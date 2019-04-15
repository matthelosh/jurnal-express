var express = require('express')
var path = require('path')
var app = express()
var passport = require('passport')
var session = require('express-session')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var env = require('dotenv').load()
var logger = require('morgan')
var flash = require('connect-flash')
var settings = require('./config/settings')
var favicon = require('express-favicon')
// var cron = require('node-cron')
var CronJob = require('cron').CronJob
var fs = require('fs')
var Logabsen = require('./controllers/LogAbsenController.js')


// /favicon/
app.use(favicon(__dirname+'/public/img/logo-jas.png'))

app.use(bodyParser.json({limit: "50mb"}))
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

app.use(session({secret: process.env.SECRET ,resave: false, saveUninitialized:false, cookie: {maxAge:null}}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.locals = settings

var expressValidator = require('express-validator')
var port = process.env.PORT || 3000
var web = require('./routes/web-routes')
var ajaxRoute = require('./routes/ajaxRoute')
// var User = require('./models/user')

app.use(expressValidator())

var models = require('./models')
var authRoute = require('./routes/auth')(app, passport)

require('./config/passport/passport')(passport, models.user)

app.use(logger('dev'))

app.use(express.static('public'))
app.set('views', './views')
app.set('view engine', 'pug')
app.use(cookieParser())


// app.use((req, res, next) => {
// 	if (req.cookies.user_sid && !req.session.user) {
// 		res.clearCookie('user_sid')
// 	}
// 	next()
// })



models.sequelize.sync().then(function() {
	// console.log('DB looks fine')
}).catch(err => {
	// console.log(err, "Ada yang salah dengan koneksi DB")
})

// var User = models.User
// var Rombel = models.Rombel
app.use('/', web)

app.use('/xhr', ajaxRoute)
app.use('*', (req,res, next) => {
	res.status(404).redirect('/404')
})
require('browser-refresh-client').isBrowserRefreshEnabled();
// const CronJob = require 

const Tasks = [
		{
			time: '33 23 * * * ', msg: function(){ Logabsen.activate()}
		},
		{
			time: '10 29 23 * * * ', msg: 'Tugas 2'
		}
	]
const crons = {}
Tasks.forEach((task, index) => {
	crons[index] = new CronJob(task.time, function(){
		task.msg()
	}, null, true, 'Asia/Jakarta')
})
// const task1 = new CronJob('* 23 23 * * *', function() {
// 	console.log('Hi')
// }, null, true, 'Asia/Jakarta')
// const task2 = new CronJob('25 23 * * *', function() {
// 	console.log('Salam')
// }, null, true, 'Asia/Jakarta')


app.listen(port, () => {
	// console.log(app.locals.siteTitle)
	if (process.send) {
    process.send({ event:'online', url:'http://localhost:3000/' });
}
})