var bCrypt = require('bcrypt')
var secret = require('./../settings')

module.exports = (passport, user) => {
	var models = require('./../../models/')
	var User = models.User
	var LocalStrategy = require('passport-local').Strategy
	var JWTStrategy = require('passport-jwt').Strategy
	var ExtractJWT = require('passport-jwt').ExtractJwt


	passport.serializeUser((user,done) => {
		// console.log(user)
		done(null, user.id, user)
	})

	passport.deserializeUser((id, done) => {
		User.findOne({where:{id:id}, attributes: {exclude:['password']}}).then(user => {
			if (user) {
				var Rombel = models.Rombel
				Rombel.findOne({where:{userId:user.userid}})
					.then(rombel => {
						if (rombel) {
							user.wali ='benar'
							user.rombel = rombel.kodeRombel
						}
						done(null, user)
					})
				
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
			// var isValidPassword = (userpass, password) => {
			// 	return bCrypt.compareSync(password, userpass)
			// }

			

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
				var isPassValid = bCrypt.compareSync(password, user.password)
				if (isPassValid == false) {
					// var password = bCrypt.hashSync(user.password, bCrypt.genSaltSync(8), null)
					return done(null, false, req.flash('msg', 'Password tidak sesuai. Cek ulang.'))
				}
				
				console.log(isPassValid)


				var userinfo = user.get()
				// console.log(userinfo)
				return done(null, userinfo)
	// $2b$08$iHaM0WEtzkurUK3Xi6TcLea0T6V0zOZ05MR1CGZDoOeB8Gb7FC6L2 !

			}).catch(err => {
				console.log("Error :", err)

				return done(null, false, req.flash('msg', 'Server error'))
			})
		}
	))

	passport.use('api-login', new LocalStrategy({
		usernameField: 'userid',
		passwordField: 'password'
	},
		function (userid, password, cb) {
			//this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
			return User.findOne({ where: {userid: userid}})
				.then(user => {
					if (!user) {
						return cb(null, false, { message: 'Incorrect email or password.' });
					}
					var isPassValid = bCrypt.compareSync(password, user.password)
					if (isPassValid == false) {
						// var password = bCrypt.hashSync(user.password, bCrypt.genSaltSync(8), null)
						return done(null, false, req.flash('msg', 'Password tidak sesuai. Cek ulang.'))
					}
					return cb(null, user.get(), { message: 'Logged In Successfully' });
					
				})
				.catch(err => {
					// console.log('eror disini')
					cb(err)
				});

		}
	));

	var opts = {
		jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
		secretOrKey: secret.jwtSecret
	}
	passport.use(
		'jwt',
		new JWTStrategy(opts,(jwt_payload, done) => {
			try {
				User.findOne({
					where: {
						userid: jwt_payload.userid
					}
				}).then(user => {
					if (user) {
						done(null, user)
					} else {
						done(null, false)
					}
				})
			} catch(err) {
				done(err)
			}
		})
	)


}