const express = require('express')
const app = express()
const passport = require('passport')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const logger = require('morgan')
const session = require('express-session')
// const expressValidator = require('express-validator')
const port = process.env.PORT || 3000
const web = require('./routes/web-routes')
// var User = require('./models/user')
var env = require('dotenv').load()

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('public'))
app.set('views', './views')
app.set('view engine', 'pug')
app.use(cookieParser())
app.use(session({secret: 'jurnal-express', resave: false, saveUninitialized: true}))
app.use(passport.initialize())
app.use(passport.session())
// app.use(expressValidator())
// app.use((req, res, next) => {
// 	if (req.cookies.user_sid && !req.session.user) {
// 		res.clearCookie('user_sid')
// 	}
// 	next()
// })



app.use('/', web)
app.use('*', (req,res, next) => {
	res.status(404).send('Gak ketemu')
})

app.listen(port, () => console.log(`Saya mendengar lewat port ${port}!`))