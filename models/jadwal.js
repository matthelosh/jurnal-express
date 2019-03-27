'use strict';
module.exports = (sequelize, DataTypes) => {
  const Jadwal = sequelize.define('Jadwal', {
    hari: DataTypes.STRING(10),
    kode_guru: DataTypes.STRING(50),
    kode_mapel: DataTypes.STRING(30),
    kode_rombel: DataTypes.STRING(30),
    jamke: DataTypes.STRING(6),
    awal: DataTypes.STRING(20),
    akhir: DataTypes.STRING(20),
    isActive: DataType.STRING(2)
  }, {});
  Jadwal.associate = function(models) {
    // associations can be defined here
  };
  return Jadwal;
};