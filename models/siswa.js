'use strict';
module.exports = (sequelize, DataTypes) => {
  const Siswa = sequelize.define('Siswa', {
    nis: DataTypes.STRING,
    nama: DataTypes.STRING,
    hp: DataTypes.STRING,
    isActive: DataTypes.STRING
  }, {});
  Siswa.associate = function(models) {
    // associations can be defined here
  };
  return Siswa;
};