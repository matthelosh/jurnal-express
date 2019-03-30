const express = require('express')
const router = express.Router()
let middle = require('./../middlewares/webMiddlewares')
let Auth = require('./../middlewares/auth.js')
let User = require('./../models/user.js')
let authController = require('./../controllers/AuthController')
let AdminController = require('./../controllers/contentAdminController')
let UserController = require('./../controllers/UserController')
let RombelController = require('./../controllers/RombelController')
let SiswaController = require('./../controllers/SiswaController')
let MapelController = require('./../controllers/MapelController')
let JadwalController = require('./../controllers/JadwalController')

// Users ROute
router.get('/getSelectUsers', Auth.isLoggedIn, UserController.getAll4Select)
router.post('/create-user', Auth.isLoggedIn, UserController.createOne)
router.post('/import-users', Auth.isLoggedIn, UserController.importMany)
router.delete('/deleteOne', Auth.isLoggedIn, UserController.deleteOne)
router.get('/getOne/:id', Auth.isLoggedIn, UserController.getOne)
router.put('/update-user', Auth.isLoggedIn, UserController.updateOne) 

// Rombels Route
router.get('/get-select-rombels', Auth.isLoggedIn, RombelController.getAll4Select)
router.post('/create-rombel', Auth.isLoggedIn, RombelController.createOne)
router.get('/get-all-rombels', Auth.isLoggedIn, RombelController.getAllRombels)
router.post('/import-rombels', Auth.isLoggedIn, RombelController.importMany)
router.delete('/delete-rombel', Auth.isLoggedIn, RombelController.deleteOne)
router.get('/get-one-rombel/:id', Auth.isLoggedIn, RombelController.getOne)
router.get('/get-data-rombel/:id', Auth.isLoggedIn, RombelController.getDataRombel)

router.put('/update-rombel', Auth.isLoggedIn, RombelController.updateOne)

// Siswas Route
router.post('/import-siswas', Auth.isLoggedIn, SiswaController.importMany)
router.post('/create-siswa', Auth.isLoggedIn, SiswaController.createOne)
router.delete('/delete-siswa', Auth.isLoggedIn, SiswaController.deleteOne)
router.get('/get-one/:id', Auth.isLoggedIn, SiswaController.getOne)
router.put('/update-siswa', Auth.isLoggedIn, SiswaController.updateOne)
router.get('/non-members', Auth.isLoggedIn, SiswaController.getNonMembers)
router.put('/keluarkan-member', Auth.isLoggedIn, SiswaController.delFromRombel)
router.put('/pindahkan-member', Auth.isLoggedIn, SiswaController.movFromRombel)
router.put('/masukkan-member', Auth.isLoggedIn, SiswaController.inputToRombel)

// Mapels Route
router.post('/create-mapel', Auth.isLoggedIn, MapelController.createOne)
router.get('/data-mapel/:id', Auth.isLoggedIn, MapelController.getDataMapel)
router.post('/import-mapels', Auth.isLoggedIn, MapelController.importMany)
router.put('/update-mapel', Auth.isLoggedIn, MapelController.updateOne)
router.get('/get-select-mapels', Auth.isLoggedIn, MapelController.getAll4Select)

// Jadwal Routes
router.post('/create-jadwal', Auth.isLoggedIn, JadwalController.createOne)
router.post('/import-jadwals', Auth.isLoggedIn, JadwalController.importMany)
module.exports = router