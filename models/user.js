// 'use strict';
var Sequelize = require('sequelize')
var Bcrypt = require('bcrypt')
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userid: DataTypes.STRING,
    password: DataTypes.STRING,
    fullname: DataTypes.STRING,
    hp: DataTypes.STRING,
    chatId: DataTypes.STRING,
    isActive: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: (user) => {
        const salt = Bcrypt.genSaltSync()
        user.password = Bcrypt.hashSync(user.password, salt)
      }
    },
    instanceMethods: {
      validPassword: function(password) {
        return Bcrypt.compareSync(password, this.password)
      }
    }
  });

  sequelize.sync()
      .then(() => console.log('Table user telah dibuat'))
      .catch(err => console.log('Error terjadi: ', err))
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};