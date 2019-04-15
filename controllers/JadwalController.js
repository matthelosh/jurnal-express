var exports = module.exports = {}
var bCrypt = require('bcrypt')
var models = require('./../models')
var Jadwal = models.Jadwal
var Sequelize = require('sequelize')


exports.getAllJadwals = (req,res)=>{
	Jadwal.findAll().then(jadwals => {
		res.json({status: 'sukses', msg: 'Data Semua Jadwal', data: jadwals})
	})
}
exports.createOne = (req,res) => {
	// newPass = generateHash(req.body.password)
	// var User = models.user
	var kodeJadwal = req.body.hari.substr(0,3)+req.body.guruId+req.body.mapelId+req.body.rombelId+req.body.jamKeAwal+req.body.jamKeAkhir
	Jadwal.findOne({
		where: {
			kodeJadwal: kodeJadwal,
		}
	}).then(mapel => {
		if (mapel) {
			res.json({
				status: 'gagal',
				msg: 'Jadwal ini telah terpakai. Gunakan yang lain.',
				data: ''
			})
		} else {
			
			createJadwal()
		}
	})
	async function createJadwal(){
		await Jadwal.create({
			kodeJadwal : kodeJadwal,
			hari: req.body.hari,
			guruId: req.body.guruId,
			mapelId: req.body.mapelId,
			rombelId: req.body.rombelId,
			jamke: req.body.jamKeAwal+'-'+req.body.jamKeAkhir
		})

		// Jadwal.findAll({include:[models.User, models.Mapel, models.Rombel]}).then(jadwals => {
		// 	res.json({status: 'sukses', msg: 'Data Semua Mapel', data: jadwals})
		// })
		getJadwals(req, res)
	}
	
}
exports.importMany = (req, res) =>{
	var newJadwals = req.body.datas
	Jadwal.bulkCreate(newJadwals, {ignoreDuplicates: true})
		.then(() => {
			return Jadwal.findAll({include: [models.User, models.Mapel, models.Rombel]})
		})
		.then(jadwals => {
			res.json({
				status: 'sukses',
				isi: 'jadwals',
				msg: 'Import Jadwals Berhasil.',
				data: jadwals
			})
		})
		.catch(err=>{
			console.log(err)
		})
}

exports.deleteOne = (req,res) => {
	var id = req.body.id
	Jadwal.destroy({where: {id: id}}).then(del => {
		if (del){
			getJadwals(req, res)
		}
	}).catch(err => {
		res.json({
			status: 'gagal',
			msg: 'Gagal menghapus jadwal: '+err,
			data: err
		})
	})
}

exports.getOne = (req, res) => {
	var id = req.params.id
	// console.log(req.params)
	Jadwal.findOne({
		where: {id:id},
		include:[models.User, models.Mapel, models.Rombel]
	})
	.then(jadwal => {
		res.json({
			status: 'sukses',
			msg: 'Data jadwal '+ jadwal.kodeJadwal,
			data: jadwal
		})
	}).catch(err => {
		res.json({
			status: 'gagal',
			msg: 'Jadwal tidak ditemukan',
			data: err
		})
	})
}

exports.updateOne = (req, res) => {
	var id = req.body.id
	var kodeJadwal = req.body.hari.substr(0,3)+req.body.guruId+req.body.mapelId+req.body.rombelId+req.body.jamKeAwal+req.body.jamKeAkhir
	var jadwal = {
		kodeJadwal : kodeJadwal,
		hari: req.body.hari,
		guruId: req.body.guruId,
		mapelId: req.body.mapelId,
		rombelId: req.body.rombelId,
		jamke: req.body.jamKeAwal+'-'+req.body.jamKeAkhir
		// jamke: req.body.jamKeAwal+'-'+req.body.jamKeAkhir
	}
	update(jadwal)

	async function update(jadwal){
		await Jadwal.update(jadwal, {where: {id:id}})

		// Mapel.findAll().then(mapels => {
		// 	res.json({status: 'sukses', msg: 'Data Semua Mapel', data: mapels})
		// })
		getJadwals(req, res)
	}
}

exports.getDataJadwal = (req, res) => {
	var id = req.params.id

	Jadwal.findOne({
		where: {id:id},
		include:[models.User, models.Mapel, models.Rombel]
		})
		.then(jadwal => {
			if (jadwal) {
				res.json({
					status: 'sukses',
					msg: 'Data jadwal: '+mapel.kodeJadwal,
					data: jadwal
				})
			} 
		}).catch(err => {
			res.json({
					status: 'gagal',
					msg: 'Data jadwal: '+mapel.kodeJadwal+' tidak ditemukan',
					data: err
				})
		})
}

function getJadwals(req, res){
	Jadwal.findAll({include:[models.User, models.Mapel, models.Rombel]}).then(jadwals => {
			res.json({status: 'sukses', msg: 'Data Semua Mapel', data: jadwals})
		})
}
