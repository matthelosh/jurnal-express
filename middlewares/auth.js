const jwt = require('jsonwebtoken')
const secret = require('./../config/settings').jwtSecret

module.exports = {
	isAuth: (req, res, next) => {
		try {
			const token = req.headers.token
			var decoded = jwt.verify(token, secret)
			req.user = decoded
			next()
		} catch(err) {
			res.status(401).json({
				msg: 'Token invalid'
			})
		}
	},
	isAuthorized: (req, res, next) => {
		if(req.user.role == 'admin') {
			next()
		} else {
			res.status(401).json({
				msg: 'User not Authorized'
			})
		}
	},
	sessionChecker : (req, res, next) => {
		if (req.session.user && req.cookies.user_sid) {
			res.redirect('/dashboard')
		} else {
			next()
		}

	},
	isLoggedIn : (req,res,next) => {
		if (req.isAuthenticated()) {
			return next()
		}
		res.redirect('/login')
	},
	isAdmin: (req, res, next) => {
		if (req.isAuthenticated() && req.user.level == '1') {
			return next()
		}
		res.redirect('/403')
	}
}