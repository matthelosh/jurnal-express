var exports = module.exports = {}

var models = require('./../models')

exports.menu = (req,res) => {
	var me = req.user
	switch(req.params.menu) {
		case 'users':
			
			var User = models.User
			User.findAll().then(users => {
				if (users) {
					res.render('blankpage', {title: 'Manajemen User', user:me, status: 'ok', 'p' : req.params.menu, data: users})
				}
			})
			
		break;
		case 'siswas':
			var Siswa = models.Siswa
			Siswa.findAll({include:[models.Rombel]}).then(siswas => {
				if (siswas) {
					res.render('blankpage', { title: 'Manajemen Siswa', user:me, status: 'ok', 'p' : req.params.menu, data: siswas })
					// console.log(siswas)
				}
			})
		break;

		case 'rombel': 
			var Rombel = models.Rombel
			Rombel.findAll({include:[ models.User ]}).then(rombels => {
				res.render('blankpage', {title: 'Manajemen Rombel', user:me, status: 'ok', 'p' : req.params.menu, data: rombels})
				// res.json(rombels)
				// console.log(rombels)
			})
		break
		case 'mapel':
			var Mapel = models.Mapel
			Mapel.findAll()
				.then(mapels => {
					res.render('blankpage', {title: 'Manajemen Mapel', user:me, status: 'ok', p : req.params.menu, data: mapels})
				})
		break
		case 'jadwal':
			var Jadwal = models.Jadwal
			Jadwal.findAll({include: [models.User, models.Mapel, models.Rombel]})
				.then(jadwals => {
					res.render('blankpage', { title: 'Manajemen Jadwal', user:me, status: 'ok', p: req.params.menu, data: jadwals })
					// console.log(jadwals)
				})
		break

		default:
			res.send(req.params.menu)
		break;
	}
}