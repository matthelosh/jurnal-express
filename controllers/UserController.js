var exports = module.exports = {}
var bCrypt = require('bcrypt')
var models = require('./../models')
var fs = require('fs')
var User = models.User
var Sequelize = require('sequelize')
var multer = require('multer')
// var path = require('path')

let storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './public/img/profiles/')
	},
	filename: (req, file, cb) => {
		cb(null, req.user+'.jpg' )
	}
})
var upload = multer({storage})

// var upload = multer({storage:storage})
// exports.postFotoUser = (req, res) => {
// 	// console.log(req.file)
// 	var tmp_path = req.file.path;

// 	/** The original name of the uploaded file
// 		stored in the variable "originalname". **/
// 	var target_path = 'uploads/' + req.file.originalname;

// 	/** A better way to copy the uploaded file. **/
// 	var src = fs.createReadStream(tmp_path);
// 	var dest = fs.createWriteStream(target_path);
// 	src.pipe(dest);
// 	src.on('end', function () { res.render('complete'); });
// 	src.on('error', function (err) { res.render('error'); });
	
	
	
// }
exports.updatePart = (req, res) => {
	var id = req.body.id,
		field = req.body.field,
		value = (field == 'password')? generateHash(req.body.value) : req.body.value

		update(field, value, id)

	async function update(field, value, id){
		var data = (field == 'fullname')? {fullname: value}:(field == 'hp')?{hp:value}:{password: value}
		try {
		var updStatus = await User.update(data, { where: { id: id } })
		var me = await User.findOne({where: {id: id}, attributes:{exclude:['password']}} )
		res.json({
			status: 'sukses',
			msg: value,
			data: me
		})
		// console.log(me)
		} catch(err) {
			res.json({
				status: 'gagal',
				msg: 'Gagal edit ' + field,
				data: err
			})
		}
	}
	
		
}
exports.postFotoProfil = (req, res) => {
	var tmp_path = req.file.path;
	var fs = require('fs')
    /** The original name of the uploaded file
        stored in the variable "originalname". **/
	var target_path = './public/img/profiles/' + req.user.userid + '.jpg';

	// /** A better way to copy the uploaded file. **/
	var src = fs.createReadStream(tmp_path);
	var dest = fs.createWriteStream(target_path);
	src.pipe(dest);
	src.on('end', function () {
		models.User.update({ foto: 'ada' }, { where: { userid: req.user.userid } })
			.then(ok => {
				res.json({
					status: 'sukses',
					msg: 'Profil telah diupload',
					data: ok
				})
			})
	});
	src.on('error', function (err) {
		res.json({
			status: 'gagal',
			msg: 'Gagal Upload Foto Profil',
			data: err
		})
	});
}
exports.postFotoLatar = (req, res) => {
	
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
		models.User.update({ latar: 'ada' }, { where: { userid: req.user.userid } })
			.then(ok => {
				res.json({
					status: 'sukses',
					msg: 'Latar telah diupload',
					data: ok
				})
			})
	});
	src.on('error', function (err) {
		res.json({
			status: 'gagal',
			msg: 'Gagal Upload Foto Latar',
			data: err
		})
	});
}
exports.getAll4Select = (req,res) => {
	let datas = []
	if (!req.query.q || req.query.q == null) {
		User.findAll().then(users => {
			users.forEach(item => {
				if (item.level == '2')
					datas.push({id: item.userid, text: item.fullname})
			})
			return datas
		}).then(datas => {
			res.json({items: datas, status: 'sukses'})
		})
	} else {
		var q = req.query.q
		const Op = Sequelize.Op
		User.findAll({
			where: {
				fullname:{[Op.like]: '%'+q+'%'}
			}
		}).then(users => {
			users.forEach(item => {
				if (item.level == '2')
					datas.push({id: item.userid, text: item.fullname})
			})
			return datas
		}).then(datas => {
			res.json({items: datas, status: 'sukses', msg: '%'+q+'%'})
		})
	}
}
exports.createOne = (req,res) => {
	newPass = generateHash(req.body.password)
	// var User = models.user
	User.findOne({
		where: {
			userid: req.body.userid
		}
	}).then(user => {
		if (user) {
			res.json({
				status: 'gagal',
				msg: 'Data User: '+ req.body.fullname +', telah terpakai. Gunakan yang lain.',
				data: ''
			})
		} else {
			User.create({
				userid: req.body.userid,
				password: newPass,
				fullname: req.body.fullname,
				hp: req.body.hp,
				chatId: req.body.chatId,
				level: req.body.level
			}).then(newUser => {
				if (newUser) {
					User.findAll().then(users=>{
						res.json({
						status: 'sukses',
						msg: 'Data User Baru'+ req.body.fullname +' tersimpan',
						data: users
						})
					})
					
				}
			})
		}
	})

	
}
exports.importMany = (req, res) =>{
	var newUsers = req.body.datas
	var jml = newUsers.length
	// async function impor() {
	// 	await newUsers.forEach((newUser) => {
	// 		var newPass = generateHash(newUser.password)
	// 		var userid = (newUser.userid.length == 1) ? '00'+newUser.userid : (newUser.userid.length == 2)? '0'+newUser.userid:newUser.userid
	// 		User.create({
	// 			userid: userid,
	// 			password: newPass,
	// 			fullname: newUser.fullname,
	// 			hp: newUser.hp,
	// 			chatId: newUser.chatId,
	// 			level: newUser.level
	// 		})
	// 	})
	// 	// setTimeout(function() {
	// 	User.findAll().then(users => {
	// 		res.json({
	// 			status: 'sukses',
	// 			msg: 'Data User Baru sejumlah: '+ jml +' orang telah tersimpan.',
	// 			data: users
	// 		})
	// 	})
	// 	// }, 500)	
	// }
	
	// impor()
	User.bulkCreate(newUsers, {ignoreDuplicates: true})
		.then(() => {
			return User.findAll()
		})
		.then(users => {
			res.json({
				status: 'sukses',
				isi: 'users',
				msg: 'Import User Berhasil.',
				data: users
			})
		})
		.catch(err=>{
			console.log(err)
		})

	// User.cek('074').then((result=>{console.log(result)})).catch(err=>{
	// 	console.log(err)
	// })	
}

exports.deleteOne = (req,res) => {
	var id = req.body.id
	User.destroy({where: {id: id}}).then(del => {
		if (del){
			User.findAll().then(users => {
				res.json({
					status: 'sukses',
					msg: 'Data User Baru tersimpan',
					data: users
				})
			})
		}
	})
}

exports.getOne = (req, res) => {
	var id = req.params.id
	// console.log(req.params)
	User.findOne({where:{id:id}})
		.then(user => {
			if (user) {
				res.json({
					status: 'sukses',
					msg: 'Data User :'+user.fullname,
					data: user
				})
			} else {
				res.json({
					status: 'sukses',
					msg: 'Data User tidak ditemukan.:(',
					data: ''
				})
			}
		})
}

exports.updateOne = (req, res) => {
	var id = req.body.id
	user ={}
	if(req.body.password) {
		user = {
			userid : req.body.userid,
			password : generateHash(req.body.password),
			fullname: req.body.fullname,
			hp: req.body.hp,
			chatId: req.body.chatId,
			level: req.body.level
		}
	} else {
		user = {
			userid : req.body.userid,
			// password : req.body.password,
			fullname: req.body.fullname,
			hp: req.body.hp,
			chatId: req.body.chatId,
			level: req.body.level
		}
	}
	User.update(user, {where: {id: req.body.id}})
		.then(updated => {
			User.findAll().then(users=>{
				res.json({
				status: 'sukses',
				msg: 'User '+req.body.fullname+' telah diperbarui',
				data: users
				})
			})
		})
		.catch(err => {
			console.log(err)
		})
	console.log(user)
}

var generateHash = (password) => {
	return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null)
}