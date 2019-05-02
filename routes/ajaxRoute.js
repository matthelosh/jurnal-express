const express = require('express')
const router = express.Router()
var fs = require('fs')
var multer = require('multer')
let middle = require('./../middlewares/webMiddlewares')

let Auth = require('./../middlewares/auth.js')
let models = require('./../models')
let authController = require('./../controllers/AuthController')
let AdminController = require('./../controllers/contentAdminController')
let UserController = require('./../controllers/UserController')
let RombelController = require('./../controllers/RombelController')
let SiswaController = require('./../controllers/SiswaController')
let MapelController = require('./../controllers/MapelController')
let JadwalController = require('./../controllers/JadwalController')
let LogAbsenController = require('./../controllers/LogAbsenController')
let AbsenController = require('./../controllers/AbsenController')
let JurnalGuruController = require('./../controllers/JurnalGuruController')

const storage = multer.diskStorage({ // notice you are calling the multer.diskStorage() method here, not multer()
    destination: function (req, file, cb) {
        cb(null, './public/img/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
const upload = multer({ storage });
// var type = upload.single('userFoto')
// Users ROute
router.get('/getSelectUsers', Auth.isLoggedIn, UserController.getAll4Select)
router.post('/create-user', Auth.isLoggedIn, UserController.createOne)
router.post('/import-users', Auth.isLoggedIn, UserController.importMany)
router.delete('/deleteOne', Auth.isLoggedIn, UserController.deleteOne)
router.get('/getOne/:id', Auth.isLoggedIn, UserController.getOne)
router.put('/update-user', Auth.isLoggedIn, UserController.updateOne)
router.put('/edit-part-user', Auth.isLoggedIn, UserController.updatePart)
router.post('/foto-latar', Auth.isLoggedIn, upload.single('fotoLatar'), UserController.postFotoLatar)
router.post('/profil', Auth.isLoggedIn, upload.single('userFoto'), UserController.postFotoProfil)

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
router.delete('/delete-jadwal', Auth.isLoggedIn, JadwalController.deleteOne)
router.get('/data-jadwal/:id', Auth.isLoggedIn, JadwalController.getOne)
router.put('/update-jadwal', Auth.isLoggedIn, JadwalController.updateOne)

// Monitor Jadwal
router.post('/activate-jadwal', Auth.isLoggedIn, LogAbsenController.activate)
router.put('/ijinkan-guru', Auth.isLoggedIn, LogAbsenController.ijinkanGuru)
router.put('/tutup-jadwal', Auth.isLoggedIn, LogAbsenController.tutupJadwal)

// Guru ROuter
router.get('/guru/get-siswa-rombel', Auth.isLoggedIn, SiswaController.getByRombel)

// Guru Absen Router
router.post('/guru/do-absen', Auth.isLoggedIn, AbsenController.doAbsen)
router.get('/guru/detil-absenku', Auth.isLoggedIn, AbsenController.getDetilAbsen)
router.put('/ubah-absen', Auth.isLoggedIn, AbsenController.ubahAbsen)

// Wali Kelas
router.get('/rekap-wali', Auth.isLoggedIn, AbsenController.getRekapWali)
router.get('/rekap-hari', Auth.isLoggedIn, AbsenController.getRekapHari)

// Jurnal guru
router.post('/tulis-jurnal-guru', Auth.isLoggedIn, JurnalGuruController.createOne)
router.put('/update-jurnal-guru', Auth.isLoggedIn, JurnalGuruController.updateOne)
router.delete('/hapus-jurnal', Auth.isLoggedIn, JurnalGuruController.deleteOne)
router.get('/get-jurnal/:id', Auth.isLoggedIn, JurnalGuruController.getOne)

// Jampel
router.get('/get-jampel', Auth.isLoggedIn, Auth.isAdmin, (req,res) => {
    // var time = req.params.time
    var Jampel = models.Jampel
    Jampel.findAll()
    .then(jampels => {
        res.json({
            status: 'sukses',
            msg: 'Jam PElajaran',
            data: jampels
        })
    })
})
module.exports = router