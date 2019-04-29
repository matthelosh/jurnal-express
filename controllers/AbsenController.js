var exports = module.exports = {}
var bCrypt = require('bcrypt')
var models = require('./../models') 
var Absen = models.Absen
var Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const pejabats = require(__dirname + '/../config/settings').chatIdLapor
sequelize = new Sequelize(config.database, config.username, config.password, config);


const BotTelegram = require('node-telegram-bot-api')
const token = process.env.TOKEN_BOT1
const bot = new BotTelegram(token, {polling: false})
let moment = require('moment-timezone')
moment.locale('id')

var d = new Date()
var tgl = (d.getDate() <= 9)? '0'+d.getDate():d.getDate()
var bln = ((d.getMonth()+1) <= 9)? '0'+(d.getMonth()+1):d.getMonth()+1
var th = d.getFullYear()
var tanggalHariIni = moment(th+'-'+bln+'-'+tgl).tz('Asia/Jakarta').format()
// var tanggalHariIni = moment()

String.prototype.count=function(s1) { 
    return Number((this.length - this.replace(new RegExp(s1,"g"), '').length) / s1.length);
}

exports.ubahAbsen = (req, res) => {
	var nis = req.body.nis
	var kode = req.body.kodeAbsen
	var ket = req.body.ket
	var ketAwal = req.body.ketAwal

	var LogAbsen = models.LogAbsen
	var newKet = {}
	newKet[ket] = 
	newKet[ketAwal]--

	async function ubah(){
		try {
			await Absen.update({ket:ket}, {where: {kodeAbsen:kode, siswaId:nis}})
			await LogAbsen.increment(ket, {where: {kodeAbsen:kode}})
			await LogAbsen.decrement(ketAwal, {where: {kodeAbsen:kode}})
		} catch(err) {
			console.log(err)
		} finally {
			res.json({
				status: 'sukses',
				msg: 'Sukses mengubah absen',
				data: ''
			})
		}
	}
	ubah()
		

}
exports.getRekapWali = (req, res) => {
	async function getRekap(){
		try {
			var absens
			var siswas = await models.Siswa.findAll({
				where:{
					kelasId: req.query.rombelId
				}
			})

			var absens = await Absen.findAll({
				where: {
					rombelId: req.query.rombelId,
					tanggal: {$like: req.query.tahun+'-'+((req.query.bulan.length > 1)?req.query.bulan:'0'+req.query.bulan)+'%'}
				},
				include: [models.Siswa, models.Mapel, models.User]
			})

			if (absens.length < 1){
				throw {errMsg: 'Tidak ada data absensi untuk bulan ini.'}
				// return
			}

			var datas = await absens.reduce(function(r,a,i) {
				r[a.siswaId] = r[a.siswaId] || []
				r[a.siswaId].push(a)
				// r.push(a)
				return r
			// }, [])
			}, {})
			
			// =========== Tes
			let items = []
			await Object.keys(datas).forEach(function(key, index){
			   // absens.push(datas[key])
			   items.push({nis: datas[key][0].siswaId, nama: datas[key][0].Siswa.namaSiswa, data: hitungAbsen(datas[key])})
			});
			// v s
			// items.

			var tanggals = []
			await items[0].data.forEach((item,index, self) => {
				if (!tanggals[index]) tanggals.push(item.tanggal.substr(-2))
				
			})
			await tanggals.unshift('No', 'Nama', 'NIS')
			var cols = tanggals.filter((elem,index,self) => {
				return index == self.indexOf(elem)
			})
			cols.push('rekap')

			await items.forEach((item,index) => {
					var sum = ''
					item.data.forEach((el,index) => {
						// console.log(el.status)
						sum += el.status
					})
					var h = sum.count('H'), i = sum.count('I'), s = sum.count('S'), a = sum.count('A'), t = sum.count('T')
					console.log(item.nama, h,i,s,a,t)
					item.rekap = 'H= '+h+', I='+i+', S='+s+', A='+a+', T='+t
					// cols.push('rekap')
				})

			function hitungAbsen(data) {
					var isi =[]
					data.forEach((item, index) => {
						var tgl = {}
						var key =''
						
						if(!isi[item.tanggal]) isi[item.tanggal] = ''
						isi[item.tanggal] += item.ket
					})
					var results = []
					var jmlH=0,jmlI=0,jmlS=0,jmlA=0,jmlT=0
					for(item in isi) {
						var jml = []
						var ket = isi[item]
						jml.push(Number(ket.count('h')),Number(ket.count('i')),Number(ket.count('s')),Number(ket.count('a')),Number(ket.count('t')))
						var hasil = jml.indexOf(Math.max(...jml))
						var status = (hasil == 0)? 'H':(hasil == 1)?'I':(hasil == 2)?'S':(hasil == 3)?'A':'T'
						
						if(!results[item]) results.push({tanggal: item, status : status} ) 
					}
					// results.forEach((item, index) => {
					// 	if(item.status == 'H') {
					// 		jmlH =+1
					// 	}
					// 	if(item.status == 'I') {
					// 		jmlI =+1
					// 	}
					// 	if(item.status == 'S') {
					// 		jmlS =+1
					// 	}
					// 	if(item.status == 'A') {
					// 		jmlA =+1
					// 	}
					// 	if(item.status == 'T') {
					// 		jmlT =+1
					// 	}
						
					// 	// var h = sum.count('H'), i = sum.count('I'), s = sum.count('S'), a = sum.count('A'), t = sum.count('T')
					// 	// results.push({'rekap': 'H ='+h+', I ='+i+ ', S ='+s+', A='+a+', T='+t })
					// })

					// if (!results['rekap']) results['rekap'] = 'jmlH ='+jmlH+', jmlI='+jmlI+', jmlS='+jmlS+', jmlA='+jmlA+', jmlT='+jmlT

					// console.log(results)

					
					return results 
				}

			


			

			res.json({
				status: 'sukses',
				msg: 'Data Rekap Perbulan :'+req.query.tahun+'-'+((req.query.bulan.length > 1)?req.query.bulan:'0'+req.query.bulan)+'%',
				data: items,
				cols: cols
			})
		} catch(err){
			res.json({
				status: 'gagal',
				msg: 'Gagal: '+err.errMsg,
				data: ''
			})
		} 


	}

	getRekap()
}

exports.doAbsen = (req, res) => {
	var nises = req.body.nis
	var absens = []
	var kodeAbsen = req.body.kodeAbsen // 20190404_xotr3_074_A1_8-10
	var kode = kodeAbsen.split('_')
	var tanggal = tanggalHariIni
	var jamke = kode[4]
	var guruId = kode[2]
	var mapelId = kode[3]
	var rombelId = kode[1]
	var jurnal= req.body.jurnalAjar

	var jmlSiswa = 0
	var jmlH = 0
	var jmlI = 0
	var jmlS = 0
	var jmlA = 0
	var jmlT = 0
	async function absen() {
		try {
			var LogAbsen = models.LogAbsen
			await nises.forEach(item => {
				var ket = req.body['absen-'+item]
				if (ket == 'h') {
					jmlH +=1
				} else if (ket == 'i'){
					jmlI +=1
				}else if (ket == 's'){
					jmlS +=1
				}else if (ket == 'a'){
					jmlA +=1
				}else if (ket == 't'){
					jmlT +=1
				}

				absens.push({
					kodeAbsen: kodeAbsen,
					tanggal: tanggal,
					jamke: jamke,
					siswaId: item,
					guruId: guruId,
					mapelId: mapelId,
					rombelId: rombelId,
					ket: ket,
					jurnal: jurnal,
					isValid: '0'
				})
			})

			var absen = await Absen.bulkCreate(absens,{ignoreDuplicates:true})
			var updateLog = await LogAbsen.update({
												jmlSiswa : (jmlH+jmlI+jmlS+jmlA+jmlT),
												h: jmlH,
												i: jmlI,
												s: jmlS,
												a: jmlA,
												t: jmlT,
												jurnal: jurnal,
												status: 'pelajaran'
											},{where: {kodeAbsen:kodeAbsen}})
			
			
			var text =`
					Hari, tanggal: ${moment(new Date()).format('LLLL')},
					Bpk / Ibu: ${req.user.fullname}
					telah mengabsen Kelas: ${rombelId}
					Jam Ke: ${jamke},
					Jml Siswa: ${(jmlH + jmlI + jmlS + jmlA + jmlT)},
					Hadir: ${jmlH},
					Izin: ${jmlI},
					Sakit: ${jmlS},
					Alpa: ${jmlA},
					Telat: ${jmlT},
					Jurnal: ${jurnal}
			`
			
			var report = await pejabats.forEach((item,index) => {
				bot.sendMessage(item.chatId, text).catch(err => {
					console.log(err.body, item.chatId)
				})
			})
			// console.log(updateLog)
			// var 
			res.json({
				status: 'sukses',
				msg: 'Proses absen berhasil',
				data: [absen, updateLog, report]
			})
		} catch(err) {
			res.json({
				status: 'gagal',
				msg: 'Proses absen Gagal',
				data: err
			})
		}


		

	}

	
	absen().catch(err => {console.log(err)})
	// res.json(absens)
	// console.log(req.body.kodeAbsen)
}

exports.getDetilAbsen = (req, res) => {
	var kodeAbsen = req.query.kode
	async function getDetil() {
		try {
			var absens = await Absen.findAll({
				where: {
					kodeAbsen: kodeAbsen
				},
				include: [models.Siswa, models.Mapel, models.Rombel],
				order: ['siswaId']
			})
			// function(){
			res.json({
				status: 'sukses',
				msg: 'Data detil absen',
				data: absens
			})
			// }
			console.log(absens)
			
		} catch(err) {
			res.json({
				status: 'gagal',
				msg: 'Gagal mengambil detil Absen',
				data: err

			})
		}

	}
	getDetil()
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
