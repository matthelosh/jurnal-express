'use strict';
module.exports = (sequelize, DataTypes) => {
  const Izin = sequelize.define('Izin', {
  	absenId: DataTypes.STRING,
    guruId: DataTypes.STRING,
    tugas: DataTypes.STRING,
    isiTugas: DataTypes.STRING
  }, {});
  Izin.associate = function(models) {
  	Izin.belongsTo(models.User, {foreignKey: 'guruId', targetKey:'userid'})
  	Izin.belongsTo(models.LogAbsen, {foreignKey: 'absenId', targetKey:'kodeAbsen'})
    // associations can be defined here
  };
  return Izin;
};