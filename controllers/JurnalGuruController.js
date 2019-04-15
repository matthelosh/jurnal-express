var exports = module.exports = {}
var bCrypt = require('bcrypt')
var models = require('./../models')
var JurnalGuru = models.JurnalGuru
var Sequelize = require('sequelize')

exports.getOne = (req,res) => {
	var id = req.params.id
	JurnalGuru.findOne({where: {id:id}})
			.then(jurnal => {
				res.json({
					status: 'sukses',
					msg: 'Data Jurnal',
					data: jurnal
				})
			})
			.catch(err => {
				res.json({
					status: 'gagal',
					msg: 'Gagal '+err,
					data: null
				})
			})

	
}

exports.createOne = (req, res) => {

	async function create() {
		try {
			var save = await JurnalGuru.create({
				guruId: req.user.userid,
				mulai: req.body.mulai,
				selesai: req.body.selesai,
				lokasi: req.body.lokasi,
				kegiatan: req.body.kegiatan,
				uraian: req.body.uraian
			})

			var myJurnals = getJurnals(req, res)

			res.json({
				status: 'sukses',
				msg: 'Data Jurnalku',
				data: myJurnals

			})

		
		} catch(err) {
			res.json({
				status: 'gagal',
				msg: 'Data Jurnalku: '+err,
				data: ''

			})
		}
	}

	create()
}

exports.deleteOne = (req, res) => {
	async function hapus() {
		try {
			var id = req.body.id

			var hapus = await JurnalGuru.destroy({where: {id: id}})

			var jurnals = await getJurnals(req,res)

			res.json({
				status: 'sukses',
					msg: 'Data Jurnalku',
					data: jurnals
			})
		} catch (err) {
			res.json({
				status: 'gagal',
				msg: 'Data Jurnalku: '+err,
				data: ''

			})
		}
	}

	hapus()
}

function getJurnals(req,res) {
	return new Promise((resolve, reject) => {
		var jurnals =JurnalGuru
				.findAll({
					where: {guruId: req.user.userid},
					order: [['updatedAt', 'DESC']]
				})
		jurnals ? resolve(jurnals) : reject(err)
	})
	
}