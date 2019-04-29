let authController = require('./../controllers/AuthController')
var secret = require('./../config/settings').jwtSecret
var jwt = require('jsonwebtoken')
module.exports = (app, passport) => {
	app.get('/signup', authController.signup)
	app.get('/login', authController.login)
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/dashboard',
		failureRedirect: '/login'
	}))
	// app.get('/dashboard', isLoggedIn, authController.dashboard)
	// app.get('/dashboard/profile/:userid', isLoggedIn, authController.dashWithProfile)
	// app.get('/dashboard/tes', isLoggedIn, function(req,res) {
	// 	res.send('Test router')
	// })
	// app.get('/dashboard/admin/users', isLoggedIn, authController.users)
	app.get('/logout', authController.logout)
	// app.post('/login', passport.authenticate('local-signin', {
	// 	// successRedirect: '/dashboard',
	// 	failureRedirect: '/login'
		
	// }), (req, res) => {
	// 	res.redirect('/dashboard/'+req.body.userid)
	// })

	app.post('/login', validateLogin, passport.authenticate('local-login', {
		failureRedirect:'/login',
		failureFlash: true
		// successRedirect:'/dashboard/'+
	}),(req, res) => {
		// req.flash()
		// console.log(req.flash)
			var level = (req.user.level == '1') ? 'admin' : (req.user.level == '2') ? 'guru' : 'staf'
		res.redirect('/dashboard/'+level+'/beranda')
	})

	app.post('/api-login', function(req, res, next) {
		passport.authenticate('api-login', { session: false }, (err, user, info) => {
			if (err || !user) {
				return res.status(400).json({
					message: err,
					user: user
				});
			}
			req.login(user, { session: false }, (err) => {
				if (err) {
					res.send(err);
				}
				// generate a signed son web token with the contents of user object and return it in the response
				const token = jwt.sign(user, secret);
				return res.json({ user, token });
			});
		})(req, res);
	})
	// app.post('/api-login', passport.authenticate('local-login', {
	// 		failureFlash:true
	// 	},(err,user, info) => {
			
	// 		if (err) {console.log(err)}
	// 		if (info != undefined) {console.log(info.msg)}
	// 		else {
	// 			req.logIn((user, err) => {
	// 				user.findOne({
	// 					where: {userid: user.userid}
	// 				}).then(user => {
	// 					const token = jwt.sign({id: user.userid}, secret)
	// 					res.json({
	// 						status: 'sukses',
	// 						token: token,
	// 						msg: 'Berhasil Log In',
	// 						auth: true
	// 					})
	// 				})
	// 			})
	// 		}
	// 	})
	// 	// res.send('Halo')
	// })

	app.get('/404', (req,res) => {
		res.render('404', {'pageTitle': '404', 'msg': 'Maaf! Halaman tidak ditemukan.'})
	})

	function validateLogin(req, res, next){
		req.checkBody('userid', 'Username harus dimasukkan').notEmpty()
		req.checkBody('password', 'Isikan Password').notEmpty()
		var errors = req.validationErrors()
		if (errors) {
			req.session.errors = errors
			req.session.success = false
			req.flash('msg', 'Masukkan username dan/atau password')
			res.redirect('/login')
		} else {
			next()
		}
	}
	// function isLoggedIn(req,res,next) {
	// 	if(req.isAuthenticated())
	// 		return next()
	// 	res.redirect('/login')
	// }
}