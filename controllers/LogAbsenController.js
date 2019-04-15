var exports = module.exports = {}
var bCrypt = require('bcrypt')
var models = require('./../models')
var LogAbsen = models.LogAbsen
var Sequelize = require('sequelize')
const BotTelegram = require('node-telegram-bot-api')
const token = process.env.TOKEN_BOT1
const bot = new BotTelegram(token, {polling: false})

var haris = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat','Sabtu']
var date = new Date()
// var tanggalHariIni = new Date().toISOString().substr(0, 9)
var d = new Date()
var tgl = (d.getDate() <= 9)? '0'+d.getDate():d.getDate()
var bln = ((d.getMonth()+1) <= 9)? '0'+(d.getMonth()+1):d.getMonth()+1
var th = d.getFullYear()
var tanggalHariIni = th+'-'+bln+'-'+tgl
var hariIni = haris[date.getDay()]

exports.activate = (req, res) => {
	// Kode Absen = thblntgl_kelas_guru_mapel_jamke-jamke
	var eror
	var Jadwal = models.Jadwal
	var Jampel = models.Jampel
	// var jadwals = Jadwal.findAll({where: {hari: hariIni}}).getAll()
	// var jampels = Jampel.findAll({},{ raw: true }).getAll()
	var todaysLog = []
	async function jalankan(){
		var jampels=[]
		var msg = 'Jadwal hari ini: '+hariIni+', '+tgl+'-'+bln+'-'+th+' telah aktif. :)' 
		try {
			await Jampel.findAll({},{ raw: true })
					.then(jampel => {
						jampel.forEach(jam => {
							jampels.push({awal: jam.awal, akhir: jam.akhir})
						})
					})
					.catch(err =>{
						throw err
					})
			await Jadwal.findAll({where: {hari: hariIni}})
						.then(jadwals => {
							if (jadwals.length < 1){
								msg = 'Hari ini libur atau tidak ada jadwal. :)'
							}
							jadwals.forEach(jadwal => {
								var jamkes = jadwal.jamke.split('-')
								var jamMulai = jamkes[0]-1
								var jamSelesai = (jamkes.length >1) ? jamkes[1]-1 : jamkes[0]-1

								var kodeAbsen = th+bln+tgl+'_'+jadwal.rombelId+'_'+jadwal.guruId+'_'+jadwal.mapelId+'_'+jadwal.jamke

								todaysLog.push({
									kodeAbsen: kodeAbsen,
									jamke: jadwal.jamke,
									mulai:jampels[jamMulai].awal,
									selesai: jampels[jamSelesai].akhir,
									tanggal: th+'-'+bln+'-'+tgl,
									rombelId: jadwal.rombelId,
									guruId: jadwal.guruId,
									mapelId: jadwal.mapelId,
									status: 'jamkos',
									isActive: 'buka'
								})
							})
						})
						.catch(err => {
							throw err
						})
			// await 

			await LogAbsen.bulkCreate(todaysLog, {updateOnDuplicate: ['isActive']}).catch(err => {throw err})

			var logabsens = await LogAbsen.findAll({
									where: { tanggal: tanggalHariIni},
									include: [models.User, models.Rombel, models.Mapel],
									order: ['rombelId']
								})
								.catch(err=>{throw err})


			bot.sendMessage('580331755', msg)
				.catch(err=>{
					// if(err.code == 'EFATAL'){
					// 	console.log(err.message)
					// }
					return msg = err
				})

			

		} catch(err) {
			console.log(err)
		} finally {
			return res.json({
							status: 'sukses',
							msg: msg,
							data: logabsens,
							eror: eror
						})
		}
	}

	jalankan()

}

exports.tutupJadwal = (req,res) => {
	// tanggalHariIni
	async function tutup() {
		await LogAbsen.update({isActive: 'tutup'}, {where: {tanggal: tanggalHariIni}})

		LogAbsen.findAll({
				where: {tanggal: tanggalHariIni},
				include: [models.User, models.Rombel, models.Mapel],
				order: ['rombelId']
			}).then(logabsens => {
				res.json({
						status: 'sukses',
						msg: 'Data Log Absen Hari Ini',
						data: logabsens
					})
			}).catch(err=>{
				res.json({
						status: 'gagal',
						msg: 'Data Log Absen Hari Ini: '+err,
						data: err
					})
			})
	}

	tutup()
}

exports.ijinkanGuru = (req,res) => {
	var id = req.body.id
	var Izin = models.Izin

	async function ijinkan() {
		await Izin.create({
			absenId: req.body.absenId,
			guruId: req.body.userid,
			tugas: (req.body.isiTugas)?'ada':'tidak',
			isiTugas: req.body.isiTugas
		})
		await LogAbsen.update({status: 'izin'}, {where: {id: req.body.id}})

		LogAbsen.findAll({
				where: {tanggal: tanggalHariIni},
				include: [models.User, models.Rombel, models.Mapel],
				order: ['rombelId']
			}).then(logabsens => {
				res.json({
						status: 'sukses',
						msg: 'Data Log Absen Hari Ini',
						data: logabsens
					})
			}).catch(err=>{
				res.json({
						status: 'gagal',
						msg: 'Data Log Absen Hari Ini: '+err,
						data: err
					})
			})
	}

	ijinkan()
	// LogAbsen.update
}
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
