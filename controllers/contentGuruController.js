var exports = module.exports = {}

var models = require('./../models')

var d = new Date()
var tgl = (d.getDate() <= 9)? '0'+d.getDate():d.getDate()
var bln = ((d.getMonth()+1) <= 9)? '0'+(d.getMonth()+1):d.getMonth()+1
var th = d.getFullYear()
var tanggalHariIni = th+'-'+bln+'-'+tgl

exports.menu = (req,res) => {
	var me = req.user
	switch(req.params.menu) {
		case "beranda":
			var Jadwalku = models.LogAbsen
			Jadwalku.findAll({
				where: {
					guruId: req.user.userid,
					tanggal: tanggalHariIni
				},
				include: [models.Mapel, models.Rombel]
			}).then(jadwalkus => {
				res.render('blankpage', {title: req.params.menu+process.env.APP_NAME, user:me, status: 'ok', p: req.params.menu, data:jadwalkus})
			})
		break
		
		case "jadwal":
			var Jadwal = models.Jadwal
			// async function getJadwals() {
			// 	var jadwals = await Jadwal.findAll({
			// 		where: {
			// 			guruId: req.user.userid
			// 		},
			// 		include: [models.Mapel, models.Rombel],
			// 		order: ['hari']
			// 	})

			// 	// res.render('blankpage', {title: req.params.menu+process.env.APP_NAME, user:me, status: 'ok', p: req.params.menu, data:jadwals})
			// 	// console.log(jadwals.json())
			// 	res.send(jadwals)

			// }

			// getJadwals()

			Jadwal.findAll({
					where: {
						guruId: req.user.userid
					},
					include: [models.Mapel, models.Rombel],
					order: ['hari']
				}).then(jadwals => {
					res.render('blankpage', {title: req.params.menu+process.env.APP_NAME, user:me, status: 'ok', p: req.params.menu, data:jadwals})
					// console.log(jadwals)
				})
		break

		case "absenku":
			var LogAbsen = models.LogAbsen

			async function getMyAbsen() {
				var absenkus = await LogAbsen.findAll({
								where: {
										guruId: req.user.userid,
										status: 'pelajaran',
										jmlSiswa: {$gt:0}	
									},
								order: [['kodeAbsen', 'DESC']],
								include: [models.Rombel, models.Mapel]
							})
				// var results = absenkus.json()
				// console.log(absenkus)

				var data = [
							{id:1, kodeAdbsen:'123wsd', mapelId: '090', rombelId: 'uojj', jamke: '1-9', status: 'pelajaran'},
							]

				res.render('blankpage', {title: req.params.menu+ '|'+ process.env.APP_NAME, user:me, status: 'ok', p: req.params.menu, data:absenkus})

			}
			getMyAbsen()
		break

		case "rekap-absen":
			var Absen = models.Absen
			res.render('blankpage', {title: req.params.menu+ '|'+ process.env.APP_NAME, user:me, status: 'ok', p: req.params.menu, data:''})
		break
		case "jurnalku":
			var Jurnal = models.JurnalGuru

			getJurnalku()
			async function getJurnalku(){
				var jurnals = await Jurnal.findAll({where: {guruId: req.user.userid}, order: [['updatedAt', 'DESC']]})

				res.render('blankpage', {title: req.params.menu+ '|'+ process.env.APP_NAME, user:me, status: 'ok', p: req.params.menu, data:jurnals})
			}
			
		break

		default:
			res.render('blankpage', {title: req.params.menu+process.env.APP_NAME, user:me, status: 'ok', p: req.params.menu, data:'Maaf! Fitur ini masih belum ada / dikembangkan. :)'})
		break
	}
}