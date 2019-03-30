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


// /favicon/
app.use(favicon(__dirname+'/public/img/logo-jas.png'))

app.use(bodyParser.json({limit: "50mb"}))
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

app.use(session({secret: 'jurnal-express', resave: false, saveUninitialized: true}))
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
// app.get('/', function(req,res){
// 	// User.create({
// 	// 	userid: 'bejo',
// 	// 	password: '12345',
// 	// 	fullname: 'Bejo K',
// 	// 	hp: '8078789',
// 	// 	level: '1',
// 	// 	isActive: '1'
// 	// }).then(user => {
// 	// 	Rombel.create({
// 	// 		kodeRombel: 'xtkj1',
// 	// 		namaRombel: 'X TKJ 1'
// 	// 	})
// 	// })
// 	console.log(User)
// 	User.findAll({
// 		include: [Rombel]
// 	}).then(users => {
// 		res.json(users)
// 	})
// 	// Rombel.findAll({
// 	// 	include: [User]
// 	// }
// 	// 	).then(rombels => {
// 	// 	res.json(rombels)
// 	// })
// })
app.use('/xhr', ajaxRoute)
app.use('*', (req,res, next) => {
	res.status(404).redirect('/404')
})
require('browser-refresh-client').isBrowserRefreshEnabled();
app.listen(port, () => {
	console.log(app.locals.siteTitle)
	if (process.send) {
    process.send({ event:'online', url:'http://localhost:3000/' });
}
})