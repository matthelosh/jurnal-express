var exports = module.exports = {}
var bCrypt = require('bcrypt')
var models = require('./../models')
var User = models.User
var Sequelize = require('sequelize')

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