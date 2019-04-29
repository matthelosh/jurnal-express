var multer = require('multer')
const storage = multer.diskStorage({ // notice you are calling the multer.diskStorage() method here, not multer()
	destination: function (req, file, cb) {
		cb(null, './public/img/uploads/')
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now())
	}
});
const upload = multer({ storage });


var webMiddles = {
	tes: function(req, res, next) {
		console.log('Ini mddleware tes')
		next()
	},
	upload: function(req, res, next) {
		upload.single('fotoLatar')
		var tmp_path = req.file.path;
		var fs = require('fs')
		/** The original name of the uploaded file
			stored in the variable "originalname". **/
		var target_path = './public/img/profiles/' + req.user.userid + 'L.jpg';

		// /** A better way to copy the uploaded file. **/
		var src = fs.createReadStream(tmp_path);
		var dest = fs.createWriteStream(target_path);
		src.pipe(dest);
		src.on('end', function () {
			next()
		});
		src.on('error', function (err) {
			res.json({
				status: 'gagal',
				msg: 'Gagal Upload Foto Profil',
				data: err
			})
		});
	}
}

module.exports = webMiddles