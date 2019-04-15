var exports = module.exports = {}
var bCrypt = require('bcrypt')
var models = require('./../models')
var Rombel = models.Rombel
var Siswa = models.Siswa
var Sequelize = require('sequelize')


exports.getByRombel = (req, res) => {
	var rombel = req.query.rombelId
	Siswa.findAll({where: {kelasId: rombel}})
		.then(siswas => {
			res.json({
				status: 'sukses',
				msg: 'Data Siswa Kelas' + rombel,
				data: siswas
			})
		})
}
exports.delFromRombel = (req, res) => {
	var nises= req.body.siswas
	var idRombel = req.body.idRombel

	async function bulkUpdate(nises) {
		try {
			await nises.forEach( nis => {
				Siswa.update({kelasId: null}, {where: {nis: nis}})
			})

			Siswa.findAll({where: {kelasId: idRombel}})
				.then(siswas => {
					res.json({
						status: 'sukses',
						msg: 'Sukses mengeluarkan member dari '+ idRombel,
						data: siswas
					})
				})
		} catch(err) {
			console.log(err)
		}
	}
	bulkUpdate(nises)
}
exports.movFromRombel = (req, res) => {
	var nises= req.body.siswas
	var srcRombel = req.body.srcRombel
	var dstRombel = req.body.dstRombel

	async function bulkMove(nises) {
		try {
			await nises.forEach( nis => {
				Siswa.update({kelasId: dstRombel}, {where: {nis: nis}})
			})

			Siswa.findAll({where: {kelasId: srcRombel}})
				.then(siswas => {
					res.json({
						status: 'sukses',
						msg: 'Siswa Telah dipindah deri '+ srcRombel+ 'ke '+dstRombel,
						data: siswas
					})
				})
		} catch(err) {
			console.log(err)
		}
	}
	bulkMove(nises)
}

exports.inputToRombel = (req, res) => {
	var nises= req.body.siswas
	var idRombel = req.body.idRombel

	async function bulkInput(nises) {
		try {
			await nises.forEach( nis => {
				Siswa.update({kelasId: idRombel}, {where: {nis: nis}})
			})

			Siswa.findAll({where: {kelasId: idRombel}})
				.then(siswas => {
					res.json({
						status: 'sukses',
						msg: 'Sukses Memasukkan member ke: '+ idRombel,
						data: siswas
					})
				})
		} catch(err) {
			console.log(err)
		}
	}
	bulkInput(nises)
}
exports.getNonMembers = (req, res) => {
	Siswa.findAll({where: {kelasId: null}})
		.then(siswas => {
			res.json({
				status: 'sukses',
				msg: 'Data Siswa yang belum masuk Rombel',
				data: siswas
			})
		})
		.catch(err => {
			res.json({
				status: 'gagal',
				msg: 'Error',
				data: err
			})
		})
}
exports.getAll4Select = (req,res) => {
	let datas = []
	if (!req.query.q || req.query.q == null) {
		Siswa.findAll().then(siswas => {
			siswas.forEach(item => {
				if (item.level == '2')
					datas.push({id: item.nis, text: item.namaSiswa})
			})
			return datas
		}).then(datas => {
			res.json({items: datas, status: 'sukses'})
		})
	} else {
		var q = req.query.q
		const Op = Sequelize.Op
		Siswa.findAll({
			where: {
				namaSiswa:{[Op.like]: '%'+q+'%'}
			}
		}).then(siswas => {
			res.json({items: siswas, status: 'sukses', msg: '%'+q+'%'})
		})
	}
}

exports.getAllSiswas = (req,res)=>{
	Siswa.findAll({
		include: [models.Rombel]
	}).then(siswas => {
		res.json({status: 'sukses', msg: 'Data Semua Siswa', data: siswas})
	})
}
exports.createOne = (req,res) => {
	// newPass = generateHash(req.body.password)
	// var User = models.user
	Siswa.findOne({
		where: {
			nis: req.body.nis,
		}
	}).then(siswa => {
		if (siswa) {
			res.json({
				status: 'gagal',
				msg: 'NIS: '+ req.body.nis +', sudah dipakai: '+siswa.namaSiswa+', kelas: '+siswa.kelasId,
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
			createSiswa()
		}
	})
	async function createSiswa(){
		await Siswa.create({
			nis: req.body.nis,
			namaSiswa: req.body.namaSiswa,
			kelasId: req.body.rombel,
			hp: req.body.hp
		})

		Siswa.findAll({
			include: [models.Rombel]
		}).then(siswas => {
			res.json({status: 'sukses', msg: 'Data Semua Siswa', data: siswas})
		})
	}
	
}
exports.importMany = (req, res) =>{
	var newSiswas = req.body.datas
	Siswa.bulkCreate(newSiswas, {ignoreDuplicates: true})
		.then(() => {
			return Siswa.findAll({include:[models.Rombel]})
		})
		.then(siswas => {
			res.json({
				status: 'sukses',
				isi: 'siswas',
				msg: 'Import Siswas Berhasil.',
				data: siswas
			})
		})
		.catch(err=>{
			console.log(err)
		})
	// console.log(newSiswas)
}

exports.deleteOne = (req,res) => {
	var id = req.body.id

	async function rem(){
		try {
			var hapus = await Siswa.hapus(id)
			Siswa.findAll().then(siswas => {
				res.json({
					status: 'sukses',
					msg: 'Siswa dengan kode:'+id+' telah dihapus',
					data: siswas
				})
			})
		} catch(err) {
			console.log(err)
		}
		


	}
	// Siswa.destroy({where: {id: id}}).then(del => {
	// 	if (del){
	// 		Siswa.findAll().then(siswas => {
	// 			res.json({
	// 				status: 'sukses',
	// 				msg: 'Siswa dengan kode:'+id+' telah dihapus',
	// 				data: siswas
	// 			})
	// 		})
	// 	}
	// })
	rem()
}

exports.getOne = (req, res) => {
	var id = req.params.id
	// console.log(req.params)
	Siswa.findOne({
		where: {id:id},
		include: [models.Rombel]
	})
	.then(siswa => {
		if (siswa) {
			res.json({
				status: 'sukses',
				msg: 'Data Siswa '+ siswa.namaSiswa,
				data: siswa
			})
		} else {
			res.json({
				status: 'sukses',
				msg: 'Data Siswa tidak ditemukan',
				data: ''
			})
		}
	})
}

exports.updateOne = (req, res) => {
	var id = req.body.id
	// Rombel = {}
	var siswa = {
		nis: req.body.nis,
		namaSiswa: req.body.namasiswa,
		kelasId: req.body.rombel,
		hp: req.body.hp
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
	update(siswa)

	async function update(siswa){
		await Siswa.update(siswa, {where: {id:id}})

		Siswa.findAll({
			include: [models.Rombel]
		}).then(siswas => {
			res.json({status: 'sukses', msg: 'Data Semua Ssiwa', data: siswas})
		})
	}
}
