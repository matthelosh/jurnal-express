const express = require('express')
const router = express.Router()
let middle = require('./../middlewares/webMiddlewares')
let Auth = require('./../middlewares/auth.js')
let User = require('./../models/user.js')

// router.use(middle.tes)

router.get('/', (req, res) => {
	res.render('index', {title: 'Halo', message: 'Salam'})
})
router.route('/login')
	.get(Auth.sessionChecker, (req,res) => {
		res.render('login', {title: 'Login', msg: 'Silahkan Login untuk masuk sistem'})
	})
	.post((req,res) => {
		var userid = req.body.userid,
			password = req.body.password
		User.findAll({where: {userid: userid}}).then(function(user) {
			if(!user) {
				res.redirect('/login', {title: 'Login Error', msg: 'user belum terdaftar'})
			} else if(!user.validPassword(password)) {
				res.redirect('/login', {title: 'Login Error', msg: 'password salah'})
			} else {
				req.session.user = user.dataValues
				req.redirect('/dashboard')
			}
		})
	})


router.get('/dashboard', function(req,res) {
	if (req.session.user && req.cookie.user_id) {
		res.render('blankpage', {title: 'Express'})
	} else {
		res.redirect('/login')
	}
	
})
router.get('/about', (req, res) => res.send('Tentang kami.'))

module.exports = router