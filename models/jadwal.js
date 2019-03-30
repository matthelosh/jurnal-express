'use strict';
module.exports = (sequelize, DataTypes) => {
  const Jadwal = sequelize.define('Jadwal', {
    kodeJadwal: DataTypes.STRING,
    hari: DataTypes.STRING,
    guruId: DataTypes.STRING,
    mapelId: DataTypes.STRING,
    rombelId: DataTypes.STRING,
    jamke: DataTypes.STRING
  }, {
    hooks: {
      beforeBulkCreate: (jadwals, options) => {
        jadwals.forEach(jadwal => {
          var jamke = jadwal.jamke.split('-')
          jadwal.kodeJadwal = jadwal.hari.substr(0,3)+jadwal.guruId+jadwal.mapelId+jadwal.rombelId+jamke[0]+jamke[1]
          jadwal.guruId = (jadwal.guruId.length ==1 )? '00'+jadwal.guruId:(jadwal.guruId.length == 2)?'0'+jadwal.guruId:jadwal.guruId
          jadwal.jamke = jamke[0]+'-'+jamke[1]

        })
      }
    }
  });
  Jadwal.associate = function(models) {
    // associations can be defined here
    Jadwal.belongsTo(models.Mapel,{foreignKey:'mapelId', targetKey:'kodeMapel'})
    Jadwal.belongsTo(models.User,{foreignKey:'guruId', targetKey:'userid'})
    Jadwal.belongsTo(models.Rombel,{foreignKey:'rombelId', targetKey:'kodeRombel'})
  };
  return Jadwal;
};