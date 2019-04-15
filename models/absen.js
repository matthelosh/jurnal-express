'use strict';
module.exports = (sequelize, DataTypes) => {
  const Absen = sequelize.define('Absen', {
    kodeAbsen: DataTypes.STRING,
    tanggal: DataTypes.STRING,
    jamke: DataTypes.STRING,
    siswaId: DataTypes.STRING,
    guruId: DataTypes.STRING,
    mapelId: DataTypes.STRING,
    rombelId: DataTypes.STRING,
    ket: DataTypes.STRING,
    jurnal: DataTypes.STRING,
    isValid: DataTypes.STRING
  }, {});
  Absen.associate = function(models) {
    // associations can be defined here
    Absen.belongsTo(models.Siswa, {foreignKey: 'siswaId', targetKey:'nis'})
    Absen.belongsTo(models.User, {foreignKey: 'guruId', targetKey:'userid'})
    Absen.belongsTo(models.Mapel, {foreignKey: 'mapelId', targetKey:'kodeMapel'})
    Absen.belongsTo(models.Rombel, {foreignKey: 'rombelId', targetKey:'kodeRombel'})
    Absen.belongsTo(models.LogAbsen, {foreignKey: 'kodeAbsen', targetKey:'kodeAbsen'})
  };
  return Absen;
};