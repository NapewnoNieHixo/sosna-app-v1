const db = new Dexie('ShoppingApp')
db.version(1).stores({ items: '++id,name,isPurchased' })

const itemForm = document.getElementById('itemForm')
const itemsDiv = document.getElementById('itemsDiv')


const populateItemsDiv = async () => {
  const allItems = await db.items.reverse().toArray()

  itemsDiv.innerHTML = allItems.map(item => `
    <div class="item ${item.isPurchased && 'purchased'}">
      <input
        type="checkbox"
        class="checkbox"
        onchange="toggleItemStatus(event, ${item.id})"
        ${item.isPurchased && 'checked'}
      />
      
      <div class="itemInfo">
        <p>${item.name}</p>
      </div>
     
      <button onclick="removeItem(${item.id})" class="deleteButton">
        X
      </button>
    </div>
  `).join('')
}

window.onload = populateItemsDiv

itemForm.onsubmit = async (event) => {
  event.preventDefault()

  const name = document.getElementById('nameInput').value


  await db.items.add({name})
  await populateItemsDiv()

  itemForm.reset()
}

const toggleItemStatus = async (event, id) => {
  await db.items.update(id, { isPurchased: !!event.target.checked })
  await populateItemsDiv()
}

const removeItem = async id => {
  await db.items.delete(id)
  await populateItemsDiv()
}
