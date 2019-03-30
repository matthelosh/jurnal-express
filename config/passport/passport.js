var bCrypt = require('bcrypt')

module.exports = (passport, user) => {
	var models = require('./../../models/')
	var User = models.User
	var LocalStrategy = require('passport-local').Strategy


	passport.serializeUser((user,done) => {
		// console.log(user)
		done(null, user.id, user)
	})

	passport.deserializeUser((id, done) => {
		User.findByPk(id).then(user => {
			if (user) {
				done(null, user.get())
			} else {
				done(user.errors,null)
			}
		})
	})

	passport.use('local-signup', new LocalStrategy({
		usernameField: 'userid',
		passwordField: 'password',
		passReqToCallback: true
	},

	function(req, userid, password, done){
		var generateHash = (password) => {
			return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null)
		}

		User.findOne({
			where: {
				userid:'admin'
			}
		}).then( user => {
			if(user) {
				// if (user.userid == 'admin')
				return done(null, false, req.flash(
					'msg', 'Admin Sudah Ada'
				))
			} else {
				var userPassword = generateHash(password)
				var level = (userid == 'admin')?'1':null
				var data = {
					userid: userid,
					password: userPassword,
					fullname: req.body.fullname,
					hp: req.body.hp,
					level: level
				}

				User.create(data).then((newUser, created) =>{
					if(!newUser){
						return done(null,false)
					}

					if(newUser){
						return done(null, newUser)
					}
				})
			}
		})
	}

	))



	passport.use( 'local-login', new LocalStrategy({
		usernameField: 'userid',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, userid, password, done) {
		// var User = user
		var isValidPassword = (userpass, password) => {
			return bCrypt.compareSync(password, userpass)
		}

		

		User.findOne({
			where:{
				userid:userid
			}
		}).then(user => {
			if (!user) {
				if (userid === 'admin'){
					return done(null, false, req.flash('msg', 'Tidak ada Admin.'))
				}
				return done(null, false,req.flash('msg', 'User belum terdaftar. Hub Admin'))
			}
			if (!isValidPassword(user.password, password)) {
				return done(null, false, req.flash('msg', 'Password tidak sesuai. Cek ulang'))
			}

			var userinfo = user.get()
			// console.log(userinfo)
			return done(null, userinfo)

		}).catch(err => {
			console.log("Error :", err)

			return done(null, false, req.flash('msg', 'Server error'))
		})
	}
	))


}