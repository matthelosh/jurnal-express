'use strict';
let bCrypt = require('bcrypt')
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userid: DataTypes.STRING,
    password: DataTypes.STRING,
    fullname: DataTypes.STRING,
    hp: DataTypes.STRING,
    chatId: DataTypes.STRING,
    level: DataTypes.STRING,
    foto: DataTypes.STRING,
    sosmed: DataTypes.STRING,
    latar: DataTypes.STRING,
    isActive: DataTypes.ENUM('1','0')
  }, {
    indexes:[
      {unique: true,
      fields: ['userid']}
    ],
    hooks: {
      beforeBulkCreate: (users, options) => {
        users.forEach(user=>{
          user.userid = (user.userid.length ==1 )? '00'+user.userid:(user.userid.length == 2)?'0'+user.userid:user.userid
          user.password = bCrypt.hashSync(user.password, bCrypt.genSaltSync(8), null)
        })
      }
    }
  });
  User.associate = function(models) {
    // associations can be defined here
    User.hasOne(models.Rombel,{foreignKey:'userId', sourceKey: 'userid'})
    User.hasMany(models.Jadwal,{foreignKey:'guruId', sourceKey: 'userid'})
    User.hasMany(models.Izin, {foreignKey:'guruId', sourceKey: 'userid'})
    User.hasMany(models.Absen, {foreignKey:'guruId', sourceKey: 'userid'})
    User.hasMany(models.JurnalGuru, {foreignKey:'guruId', sourceKey: 'userid'})
  };

  User.cek = (userId) => {
    return new Promise((resolve, reject) => {


      User.findOne({where:{userid:userId}}).then(data => {
        if (data) {
          return resolve(data)
        } else {
          return reject('No data')
        }
      })
    })
  }
  return User;
};