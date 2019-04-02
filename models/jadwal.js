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
        
        async function eachJadwal(){
          var kode = []
          await jadwals.forEach(jadwal => {
            var jamke = jadwal.jamke.split('-')
            var Jamke = (jamke.length >1)?jamke[0]+jamke[1]:jamke[0]
            jadwal.kodeJadwal = jadwal.hari.substr(0,3)+jadwal.guruId+jadwal.mapelId+jadwal.rombelId+Jamke
            jadwal.guruId = (jadwal.guruId.length ==1 )? '00'+jadwal.guruId:(jadwal.guruId.length == 2)?'0'+jadwal.guruId:jadwal.guruId
            jadwal.jamke = (jamke.length > 1) ? jamke[0]+'-'+jamke[1]:jamke[0]
            kode.push(jadwal.jamke)
            })
          console.log(kode)

        }

        eachJadwal()
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