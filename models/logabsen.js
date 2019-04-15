'use strict';
module.exports = (sequelize, DataTypes) => {
  const LogAbsen = sequelize.define('LogAbsen', {
    kodeAbsen: DataTypes.STRING,
    jamke: DataTypes.STRING,
    mulai: DataTypes.STRING,
    selesai: DataTypes.STRING,
    tanggal: DataTypes.STRING,
    rombelId: DataTypes.STRING,
    guruId: DataTypes.STRING,
    mapelId: DataTypes.STRING,
    jmlSiswa: {
      type: DataTypes.INTEGER
    },
    h: {
      type: DataTypes.INTEGER
    },
    i: {
      type: DataTypes.INTEGER
    },
    s: {
      type: DataTypes.INTEGER
    },
    a: {
      type: DataTypes.INTEGER
    },
    t: {
      type: DataTypes.INTEGER
    },
    jurnal: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'jamkos'
    },
    isActive: {
      type: DataTypes.STRING,
      defaultValue: 'buka'
    }
  }, {
    hooks: {
      beforeBulkCreate: (logabsens, options) => {
        logabsens.forEach(logabsen => {
          logabsen.isActive = 'buka'
        })
      }
    }
  });
  LogAbsen.associate = function(models) {
    LogAbsen.belongsTo(models.User, {foreignKey: 'guruId', targetKey: 'userid'})
    LogAbsen.belongsTo(models.Rombel, {foreignKey: 'rombelId', targetKey: 'kodeRombel'})
    LogAbsen.belongsTo(models.Mapel, {foreignKey: 'mapelId', targetKey: 'kodeMapel'})
    LogAbsen.hasOne(models.Izin, {foreignKey: 'absenId', sourceKey: 'kodeAbsen'})
    LogAbsen.hasMany(models.Absen, {foreignKey: 'kodeAbsen', sourceKey: 'kodeAbsen'})
    // LogAbsen.belongsTo(models., {foreignKey: 'mapelId', targetKey: 'kodeMapel'})
  };
  return LogAbsen;
};