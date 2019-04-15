var exports = module.exports = {}
var bCrypt = require('bcrypt')
var models = require('./../models')
var Mapel = models.Mapel
var Sequelize = require('sequelize')

exports.getAll4Select = (req,res) => {
	let datas = []
	if (!req.query.q || req.query.q == null) {
		Mapel.findAll().then(mapels => {
			mapels.forEach(item => {
				// if (item.level == '2')
				datas.push({id: item.kodeMapel, text: item.namaMapel})
			})
			return datas
		}).then(datas => {
			res.json({items: datas, status: 'sukses'})
		})
	} else {
		var q = req.query.q
		const Op = Sequelize.Op
		Mapel.findAll({
			where: {
				namaMapel:{[Op.like]: '%'+q+'%'}
			}
		}).then(mapels => {
			mapels.forEach(item => {
				// if (item.level == '2')
				datas.push({id: item.kodeMapel, text: item.namaMapel})
			})
			return datas
		}).then(datas => {
			res.json({items: datas, status: 'sukses', msg: '%'+q+'%'})
		})
	}
}

exports.getAllMapels = (req,res)=>{
	Mapel.findAll().then(mapels => {
		res.json({status: 'sukses', msg: 'Data Semua Mapel', data: mapels})
	})
}
exports.createOne = (req,res) => {
	// newPass = generateHash(req.body.password)
	// var User = models.user
	Mapel.findOne({
		where: {
			kodeMapel: req.body.kodeMapel,
		}
	}).then(mapel => {
		if (mapel) {
			res.json({
				status: 'gagal',
				msg: 'Data Mapel: '+ req.body.namaMapel +', telah terpakai. Gunakan yang lain.',
				data: ''
			})
		} else {
			
			createMapel()
		}
	})
	async function createMapel(){
		await Mapel.create({
			kodeMapel: req.body.kodeMapel,
			namaMapel: req.body.namaMapel,
		})

		Mapel.findAll().then(mapels => {
			res.json({status: 'sukses', msg: 'Data Semua Mapel', data: mapels})
		})
	}
	
}
exports.importMany = (req, res) =>{
	var newMapels = req.body.datas
	Mapel.bulkCreate(newMapels, {ignoreDuplicates: true})
		.then(() => {
			return Mapel.findAll()
		})
		.then(mapels => {
			res.json({
				status: 'sukses',
				isi: 'mapels',
				msg: 'Import Mapels Berhasil.',
				data: mapels
			})
		})
		.catch(err=>{
			console.log(err)
		})
}

exports.deleteOne = (req,res) => {
	var id = req.body.id
	Mapel.destroy({where: {id: id}}).then(del => {
		if (del){
			Mapel.findAll().then(mapels => {
				res.json({
					status: 'sukses',
					msg: 'Mapel dengan kode:'+id+' telah dihapus',
					data: mapels
				})
			})
		}
	})
}

exports.getOne = (req, res) => {
	var id = req.params.id
	// console.log(req.params)
	Mapel.findOne({
		where: {id:id}
	})
	.then(mapel => {
		if (mapel) {
			res.json({
				status: 'sukses',
				msg: 'Data Mapel '+ mapel.namaMapel,
				data: mapel
			})
		} else {
			res.json({
				status: 'sukses',
				msg: 'Data Mapel tidak ditemukan',
				data: ''
			})
		}
	})
}

exports.updateOne = (req, res) => {
	var id = req.body.id
	var mapel = {
		kodeMapel: req.body.kodeMapel,
		namaMapel: req.body.namaMapel
	}
	update(mapel)

	async function update(mapel){
		await Mapel.update(mapel, {where: {id:id}})

		Mapel.findAll().then(mapels => {
			res.json({status: 'sukses', msg: 'Data Semua Mapel', data: mapels})
		})
	}
}

exports.getDataMapel = (req, res) => {
	var id = req.params.id

	Mapel.findOne({where: {id:id}})
		.then(mapel => {
			if (mapel) {
				res.json({
					status: 'sukses',
					msg: 'Data mapel: '+mapel.namaMapel,
					data: mapel
				})
			} else {
				res.json({
					status: 'gagal',
					msg: 'Mapel tidak ditemukan',
					data: ''
				})
			}
		})
}
