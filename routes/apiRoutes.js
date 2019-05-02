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

router.get('/', Auth.isAuth, (req, res) => {
    res.send('Rute API')
})


module.exports = router