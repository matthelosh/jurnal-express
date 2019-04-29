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
var Cors = require('cors')
var multer = require('multer')
var CronJob = require('cron').CronJob
var fs = require('fs')
var Logabsen = require('./controllers/LogAbsenController.js')


// /favicon/
app.use(favicon(__dirname+'/public/img/logo-jas.png'))
app.use(Cors())
app.use(bodyParser.json({limit: "50mb"}))
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
// app.use(multer({destination: './public/img/uploads/'}).single('userFoto'))
// app.use(multer)
app.use(session({secret: process.env.SECRET ,resave: false, saveUninitialized:false, cookie: {maxAge:null}}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.locals = settings

var expressValidator = require('express-validator')
var port = process.env.PORT || 3000
var web = require('./routes/web-routes')
var ajaxRoute = require('./routes/ajaxRoute')
var apiRoute = require('./routes/apiRoutes')
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
app.use('/api', apiRoute)
app.use('/xhr', ajaxRoute)
app.use('*', (req,res, next) => {
	res.status(404).redirect('/404')
})
require('browser-refresh-client').isBrowserRefreshEnabled();
// const CronJob = require 

const Tasks = [
		{
			name: 'Aktifkan Absen',
			time: '33 23 * * * ', 
			do: function(){ Logabsen.activate()}
		},
		{
			name: 'TEs',
			time: '10 29 23 * * * ', 
			do: function() {console.log('Tugas 2')}
		},
		{
			name: 'Bel 1',
			time: '0 59 12 * * *',
			do: function() {
				console.log('Bel 1')
			}
		}
	]
const crons = {}
Tasks.forEach((task, index) => {
	crons[index] = new CronJob(task.time, function(){
		task.do()
	}, null, true, 'Asia/Jakarta')
})

// Handle Unhandled Promise Rejection
// process.on('')

app.listen(port, () => {
	// console.log(app.locals.siteTitle)
	if (process.send) {
    process.send({ event:'online', url:'http://localhost:3000/' });
}
})