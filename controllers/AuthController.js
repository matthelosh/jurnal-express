var exports = module.exports = {}
var models = require('./../models')
exports.signup = (req,res) => {
	res.render('signup', {title: 'Signup', msg: 'Isi formulir dengan info yang valid'})
}

exports.login = (req,res) => {
	res.render('login', {title:'Login', msg:req.flash('msg'), appLogo: process.env.APP_LOGO})
}

exports.dashboard = (req,res) => {
	res.render('blankpage', {title: 'Jurnal Express'})
	if(!req.user){
		res.redirect('/login')
	} else {
		var userid = req.user.userid
		res.redirect('/dashboard/profile/'+userid)
	}
}
exports.dashWithProfile = (req, res) => {
	var cookies = req.cookies
	if(req.params.userid != req.user.userid && req.user.level !='1') {
		res.redirect('/dashboard/profile/'+req.user.userid)
	}
	
		var me = req.user
		var siteTitle = process.env.APP_NAME
		res.render('blankpage', {title: siteTitle+' | Dashboard', user:me, subtitle:'Bekerja dengan tulus. :)', meta:{}})
}
exports.logout = (req, res) => {
	// req.session.destroy(err => {
	// 	res.redirect('/')
	// })
	req.logout()
	res.redirect('/')
}
