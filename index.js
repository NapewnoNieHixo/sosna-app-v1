// Initialize Dexie database
const db = new Dexie('SosnaDB')
db.version(3).stores({
  items: '++id,name,isDone,children,date,order'
})

const itemForm = document.getElementById('itemForm')
const itemsDiv = document.getElementById('itemsDiv')


// ---------------------------
// Render Notes List
// ---------------------------
const populateItemsDiv = async () => {
  const allItems = await db.items.orderBy('order').toArray()

  itemsDiv.innerHTML = allItems.map(item => `
    <div draggable="true" class="item ${item.isDone ? 'purchased' : ''}" data-id="${item.id}">
      <input
        type="checkbox"
        class="checkbox"
        onchange="toggleItemStatus(event, ${item.id})"
        ${item.isDone ? 'checked' : ''}
      />

      <div class="itemInfo">
        <p>${item.name}</p>
      </div>

      <button onclick="removeItem(${item.id})" class="deleteButton">X</button>
    </div>
  `).join('')

  attachDragEvents()
}

window.onload = populateItemsDiv


// ---------------------------
// Add New Note
// ---------------------------
itemForm.onsubmit = async (event) => {
  event.preventDefault()

  const name = document.getElementById('nameInput').value
  const date = new Date()

  const last = await db.items.orderBy('order').last()
  const newOrder = last ? last.order + 1 : 0

  await db.items.add({ name, date, order: newOrder })

  await populateItemsDiv()
  itemForm.reset()
}


// ---------------------------
// Toggle Completed Status
// ---------------------------
const toggleItemStatus = async (event, id) => {
  await db.items.update(id, { isDone: event.target.checked })
  await populateItemsDiv()
}


// ---------------------------
// Delete Note
// ---------------------------
const removeItem = async id => {
  await db.items.delete(id)
  await populateItemsDiv()
}


// ---------------------------
// Save Notes Order
// ---------------------------
async function saveOrder() {
  const items = document.querySelectorAll(".item")

  const updates = [...items].map((el, index) => {
    const id = Number(el.dataset.id)
    return db.items.update(id, { order: index })
  })

  await Promise.all(updates)
}


// ---------------------------
// Drag and Drop Sorting
// ---------------------------
function attachDragEvents() {
  const items = document.querySelectorAll(".item")
  let dragged = null

  items.forEach(item => {

    item.addEventListener("dragstart", () => {
      dragged = item
      item.classList.add("dragging")
    })

    item.addEventListener("dragend", async () => {
      item.classList.remove("dragging")
      dragged = null
      await saveOrder()
    })

    item.addEventListener("dragover", e => {
      e.preventDefault()
      item.classList.add("drag-over")
    })

    item.addEventListener("dragleave", () => {
      item.classList.remove("drag-over")
    })

    item.addEventListener("drop", () => {
      item.classList.remove("drag-over")

      if (item !== dragged) {
        const temp = document.createElement("div")
        dragged.before(temp)
        item.before(dragged)
        temp.replaceWith(item)
      }
    })
  })
}
