'use strict';
module.exports = (sequelize, DataTypes) => {
  const Rombel = sequelize.define('Rombel', {
    kodeRombel: DataTypes.STRING(20),
    namaRombel: DataTypes.STRING(30),
    wali: DataTypes.STRING(30),
    isActive: DataTypes.STRING(2)
  }, {});
  Rombel.associate = function(models) {
    // associations can be defined here
  };
  return Rombel;
};