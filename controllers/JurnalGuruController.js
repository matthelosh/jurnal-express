var exports = module.exports = {}
var bCrypt = require('bcrypt')
var models = require('./../models')
var JurnalGuru = models.JurnalGuru
var Sequelize = require('sequelize')
const pejabats = require(__dirname + '/../config/settings').chatIdLapor
const BotTelegram = require('node-telegram-bot-api')
const token = process.env.TOKEN_BOT1
const bot = new BotTelegram(token, { polling: false })
let moment = require('moment-timezone')
moment.locale('id')

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
			var text = `
				Hari, tanggal: ${moment(new Date()).format('LLLL')},
				Nama: ${req.user.fullname}
				telah  mengisi jurnal,
				Jurnal: ${req.body.kegiatan}
			`
			var lapor = await pejabats.forEach((item, index) => {
				bot.sendMessage(item.chatId, text).catch(err => {
					console.log(err.body, item.chatId)
				})
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

	create().catch(err => {
		console.log(err)
	})
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

exports.updateOne = (req, res) => {
	async function perbarui() {
		try {
			var id = req.body.id
			var jurnal = {
				mulai: req.body.mulai,
				selesai: req.body.selesai,
				lokasi: req.body.lokasi,
				kegiatan: req.body.kegiatan,
				uraian: req.body.uraian
			}
			var update = await JurnalGuru.update(jurnal, {where: {id: id}})

			var jurnals = await getJurnals(req,res)

			res.json({
				status: 'sukses',
				msg: 'Data Jurnal',
				data: jurnals
			})
		} catch (err) {
			res.json({
				status: 'gagal',
				msg: 'Gagal Perbarui Jurnal: ' + err,
				data: null
			})
		}
	}

	perbarui()
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