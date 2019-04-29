const express = require('express')
const router = express.Router()
let middle = require('./../middlewares/webMiddlewares')
let Auth = require('./../middlewares/auth.js')
let User = require('./../models/user.js')
let authController = require('./../controllers/AuthController')
let AdminContentController = require('./../controllers/contentAdminController.js')
let GuruContentController = require('./../controllers/contentGuruController.js')
let StafContentController = require('./../controllers/contentStafController.js')
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
router.get('/dashboard/admin/:menu', Auth.isLoggedIn,Auth.isAdmin, AdminContentController.menu)
// Guru Router
router.get('/dashboard/guru/:menu', Auth.isLoggedIn, GuruContentController.menu)
// Staf Router
router.get('/dashboard/staf/:menu', Auth.isLoggedIn, StafContentController.menu)
router.get('/about', (req, res) => res.send('Tentang kami.'))
router.get('/403', (req, res) => {
	res.render('403', {title: 'Tak berwenang |'+process.env.APP_NAME,pageTitle:'Anda Tidak Berwenang.', msg: 'Anda tidak boleh mengakses halaman admin.'})
})

module.exports = router