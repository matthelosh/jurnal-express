var exports = module.exports = {}
var bCrypt = require('bcrypt')
var models = require('./../models')
var Rombel = models.Rombel
var Sequelize = require('sequelize')

exports.getAll4Select = (req,res) => {
	let datas = []
	if (!req.query.q || req.query.q == null) {
		Rombel.findAll().then(rombels => {
			rombels.forEach(item => {
				// if (item.level == '2')
				datas.push({id: item.kodeRombel, text: item.namaRombel})
			})
			return datas
		}).then(datas => {
			res.json({items: datas, status: 'sukses'})
		})
	} else {
		var q = req.query.q
		const Op = Sequelize.Op
		Rombel.findAll({
			where: {
				namaRombel:{[Op.like]: '%'+q+'%'}
			}
		}).then(rombels => {
			rombels.forEach(item => {
				// if (item.level == '2')
				datas.push({id: item.kodeRombel, text: item.namaRombel})
			})
			return datas
		}).then(datas => {
			res.json({items: datas, status: 'sukses', msg: '%'+q+'%'})
		})
	}
}

exports.getAllRombels = (req,res)=>{
	Rombel.findAll({
		include: [models.User]
	}).then(rombels => {
		res.json({status: 'sukses', msg: 'Data Semua Rombel', data: rombels})
	})
}
exports.createOne = (req,res) => {
	// newPass = generateHash(req.body.password)
	// var User = models.user
	Rombel.findOne({
		where: {
			kodeRombel: req.body.kodeRombel,
		}
	}).then(rombel => {
		if (rombel) {
			res.json({
				status: 'gagal',
				msg: 'Data Rombel: '+ req.body.namaRombel +', telah terpakai. Gunakan yang lain.',
				data: ''
			})
		} else {
			// Rombel.create({
			// 	kodeRombel: req.body.kodeRombel,
			// 	namaRombel: req.body.namaRombel,
			// 	userId: req.body.wali,
			// }).then(newRombel => {
			// 	if (newRombel) {
			// 		res.json({status: 'sukses', msg: 'Rombel: '+req.body.namaRombel+', telah dibuat', data: newRombel})
					
			// 	}
			// })
			createRombel()
		}
	})
	async function createRombel(){
		await Rombel.create({
			kodeRombel: req.body.kodeRombel,
			namaRombel: req.body.namaRombel,
			userId: req.body.wali,
		})

		Rombel.findAll({
			include: [models.User]
		}).then(rombels => {
			res.json({status: 'sukses', msg: 'Data Semua Rombel', data: rombels})
		})
	}
	
}
exports.importMany = (req, res) =>{
	var newRombels = req.body.datas
	Rombel.bulkCreate(newRombels, {ignoreDuplicates: true})
		.then(() => {
			return Rombel.findAll()
		})
		.then(rombels => {
			res.json({
				status: 'sukses',
				isi: 'rombels',
				msg: 'Import Rombels Berhasil.',
				data: rombels
			})
		})
		.catch(err=>{
			console.log(err)
		})
	// console.log(newRombels)
}

exports.deleteOne = (req,res) => {
	var id = req.body.id
	Rombel.destroy({where: {id: id}}).then(del => {
		if (del){
			Rombel.findAll().then(rombels => {
				res.json({
					status: 'sukses',
					msg: 'Rombel dengan kode:'+id+' telah dihapus',
					data: rombels
				})
			})
		}
	})
}

exports.getOne = (req, res) => {
	var id = req.params.id
	// console.log(req.params)
	Rombel.findOne({
		where: {id:id},
		include: [models.User]
	})
	.then(rombel => {
		if (rombel) {
			res.json({
				status: 'sukses',
				msg: 'Data Rombel '+ rombel.namaRombel,
				data: rombel
			})
		} else {
			res.json({
				status: 'sukses',
				msg: 'Data Rombel tidak ditemukan',
				data: ''
			})
		}
	})
}

exports.updateOne = (req, res) => {
	var id = req.body.id
	// Rombel = {}
	var rombel = {
		kodeRombel: req.body.kodeRombel,
		namaRombel: req.body.namaRombel,
		userId: req.body.wali
	}
	// Rombel.update(rombel, {where: {id: id}})
	// 	.then(updated => {
	// 		Rombel.findAll().then(rombels=>{
	// 			res.json({
	// 			status: 'sukses',
	// 			msg: 'Rombel: '+req.body.namaRombel+' telah diperbarui',
	// 			data: rombels
	// 			})
	// 		})
	// 	})
	// 	.catch(err => {
	// 		console.log(err)
	// 	})
	// console.log(user)
	update(rombel)

	async function update(rombel){
		await Rombel.update(rombel, {where: {id:id}})

		Rombel.findAll({
			include: [models.User]
		}).then(rombels => {
			res.json({status: 'sukses', msg: 'Data Semua Rombel', data: rombels})
		})
	}
}

exports.getDataRombel = (req, res) => {
	var id = req.params.id

	Rombel.findOne({where: {id:id}, include:[models.Siswa]})
		.then(rombel => {
			if (rombel) {
				res.json({
					status: 'sukses',
					msg: 'Data Rombel: '+rombel.namaRombel,
					data: rombel
				})
			}
		})
}
