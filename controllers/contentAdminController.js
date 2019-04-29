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
		case 'users':
			
			var User = models.User
			User.findAll().then(users => {
				if (users) {
					res.render('blankpage', {title: 'Manajemen User'+ ' | '+process.env.APP_NAME, user:me, status: 'ok', 'p' : req.params.menu, data: users})
				}
			})
			
		break;
		case 'siswas':
			var Siswa = models.Siswa
			Siswa.findAll({include:[models.Rombel]}).then(siswas => {
				if (siswas) {
					res.render('blankpage', { title: 'Manajemen Siswa'+ ' | '+process.env.APP_NAME, user:me, status: 'ok', 'p' : req.params.menu, data: siswas })
					// console.log(siswas)
				}
			})
		break;

		case 'rombel': 
			var Rombel = models.Rombel
			Rombel.findAll({include:[ models.User ]}).then(rombels => {
				res.render('blankpage', {title: 'Manajemen Rombel'+ ' | '+process.env.APP_NAME, user:me, status: 'ok', 'p' : req.params.menu, data: rombels})
				// res.json(rombels)
				// console.log(rombels)
			})
		break
		case 'mapel':
			var Mapel = models.Mapel
			Mapel.findAll()
				.then(mapels => {
					res.render('blankpage', {title: 'Manajemen Mapel'+ ' | '+process.env.APP_NAME, user:me, status: 'ok', p : req.params.menu, data: mapels})
				})
		break
		case 'jadwal':
			var Jadwal = models.Jadwal
			Jadwal.findAll({include: [models.User, models.Mapel, models.Rombel]})
				.then(jadwals => {
					res.render('blankpage', { title: 'Manajemen Jadwal'+ ' | '+process.env.APP_NAME, user:me, status: 'ok', p: req.params.menu, data: jadwals })
					// console.log(jadwals)
				})
		break

		case 'rekap':
			res.render('blankpage', { title: 'Rekap Absensi'+ ' | '+process.env.APP_NAME, user:me, status: 'ok', p: req.params.menu, data:'' })
		break

		case 'monitor':
			var LogAbsen = models.LogAbsen
			LogAbsen.findAll({
				where: {tanggal: tanggalHariIni},
				include: [models.User, models.Rombel, models.Mapel],
				order: ['rombelId']
			}).then(logabsens => {
				if (req.query.bel) {
					let bel = req.query.bel
					let audio = (bel == '1') ? '/audio/noerhalimah-nasibBunga.mp3' : null
					res.render('blankpage', { title: 'Monitor Pembelajaran' + ' | ' + process.env.APP_NAME, user: me, status: 'ok', p: req.params.menu, data: logabsens, audio:audio })
				}
				res.render('blankpage', { title: 'Monitor Pembelajaran'+ ' | '+process.env.APP_NAME, user:me, status: 'ok', p: req.params.menu, data:logabsens })
				// console.log(tanggalHariIni,logabsens)
			}).catch(err=>{
				console.log(err)
			})
			
		break

		case "settings":
			var Jampel = models.Jampel
			var data = {}
			async function getData(){
				await Jampel.findAll().then(jampels => {
					data.jampels = jampels
				})

				res.render('blankpage', { title: 'Pengaturan'+ ' | '+process.env.APP_NAME, user:me, status: 'ok', p: req.params.menu, data:data })
			}
			getData()
			
		break

		case "beranda":
			res.render('blankpage', { title: req.params.menu + process.env.APP_NAME, user: me, status: 'ok', p: req.params.menu, data: 'Beranda' })
		break

		default:
			res.render('blankpage', {title: req.params.menu+process.env.APP_NAME, user:me, status: 'ok', p: req.params.menu, data:'Maaf! Fitur ini masih belum ada / dikembangkan. :)'})
		break;
	}
}