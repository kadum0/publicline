module.exports = {
	globDirectory: './',
	globPatterns: [
		'**/*.{png,jpg,ico,html,json,js,css}'
	],
	swDest: 'sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};