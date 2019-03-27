var webMiddles = {
	tes: function(req, res, next) {
		console.log('Ini mddleware tes')
		next()
	}
}

module.exports = webMiddles