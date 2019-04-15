'use strict';
module.exports = (sequelize, DataTypes) => {
  const Jampel = sequelize.define('Jampel', {
    awal: DataTypes.STRING,
    akhir: DataTypes.STRING
  }, {});
  Jampel.associate = function(models) {
    // associations can be defined here
    // Jampel.hasMany(models.Jadwal, {foreignKey:''})
  };
  return Jampel;
};