module.exports = {
	globDirectory: './',
	globPatterns: [
		'**/*.{jpg,js,css,html,json}'
	],
	swDest: 'sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};