const express = require('express')
const router = express.Router()
let middle = require('./../middlewares/webMiddlewares')
let Auth = require('./../middlewares/auth.js')
let User = require('./../models/user.js')
let authController = require('./../controllers/AuthController')
let AdminContentController = require('./../controllers/contentAdminController.js')

// router.use(middle.tes)

router.get('/', (req, res) => {
	res.redirect('/dashboard')
})
router.get('/dashboard', Auth.isLoggedIn, authController.dashboard)
router.get('/dashboard/profile/:userid', Auth.isLoggedIn, authController.dashWithProfile)
// router.get('/dashboard/tes', Auth.isLoggedIn, function(req,res) {
// 	res.send('Test router')
// })

// Admin Router
router.get('/dashboard/admin/:menu', Auth.isLoggedIn, AdminContentController.menu)


router.get('/about', (req, res) => res.send('Tentang kami.'))

module.exports = router