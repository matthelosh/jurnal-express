'use strict';
module.exports = (sequelize, DataTypes) => {
  const Mapel = sequelize.define('Mapel', {
    kodeMapel: DataTypes.STRING,
    namaMapel: DataTypes.STRING,
    isActive: DataTypes.STRING,
    ket: DataTypes.STRING
  }, {});
  Mapel.associate = function(models) {
    // associations can be defined here
  };
  return Mapel;
};