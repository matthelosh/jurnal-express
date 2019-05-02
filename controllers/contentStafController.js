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
			var Jurnal = models.JurnalGuru
			Jurnal.findAll({
				where: {
					guruId: req.user.userid
				},
				order:[['mulai', 'DESC']]
			}).then(jurnals => {
				res.render('blankpage', {title: req.params.menu+process.env.APP_NAME, user:me, status: 'ok', p: req.params.menu, data:jurnals})
			})
		break
		
		case "profil":
            // const me = req.user
            res.render('blankpage', {title: req.params.menu+process.env.APP_NAME, user:me, status: 'ok', p: req.params.menu})
		break
		
		case "jurnal":
			var Jurnal = models.JurnalGuru

			getJurnalku(me)
			async function getJurnalku(me){
				var jurnals = await Jurnal.findAll({where: {guruId: req.user.userid}, order: [['updatedAt', 'DESC']]})

				res.render('blankpage', {title: req.params.menu+ '|'+ process.env.APP_NAME, user:me, status: 'ok', p: req.params.menu, data:jurnals})
			}
			
		break

        default:
            // let me = req.user
			res.render('blankpage', {title: req.params.menu+process.env.APP_NAME, user:me, status: 'ok', p: req.params.menu, data:'Maaf! Fitur ini masih belum ada / dikembangkan. :)'})
		break
	}
}