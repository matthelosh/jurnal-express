let authController = require('./../controllers/AuthController')
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
		res.redirect('/dashboard/profile/'+req.body.userid)
	})

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