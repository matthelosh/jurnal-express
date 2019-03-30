'use strict';
module.exports = (sequelize, DataTypes) => {
  const Mapel = sequelize.define('Mapel', {
    kodeMapel: DataTypes.STRING,
    namaMapel: DataTypes.STRING
  }, {});
  Mapel.associate = function(models) {
    // associations can be defined here
    Mapel.hasMany(models.Jadwal, {foreignKey: 'mapelId', sourceKey:'kodeMapel'})
  };
  return Mapel;
};