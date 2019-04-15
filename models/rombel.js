'use strict';
module.exports = (sequelize, DataTypes) => {
  const Rombel = sequelize.define('Rombel', {
    kodeRombel: DataTypes.STRING,
    namaRombel: DataTypes.STRING,
    userId: DataTypes.STRING
  }, {
    hooks: {
      beforeBulkCreate: (rombels, options) => {
        rombels.forEach(rombel=>{
          rombel.userId = (rombel.userId.length ==1 )? '00'+rombel.userId:(rombel.userId.length == 2)?'0'+rombel.userId:rombel.userId
          // user.password = bCrypt.hashSync(user.password, bCrypt.genSaltSync(8), null)
        })
      }
    }
  });
  Rombel.associate = function(models) {
    // associations can be defined here
    Rombel.belongsTo(models.User, {foreignKey: 'userId', targetKey:'userid'})
    Rombel.hasMany(models.Siswa, {foreignKey: 'kelasId', sourceKey: 'kodeRombel'})
    Rombel.hasMany(models.Jadwal, {foreignKey: 'rombelId', sourceKey: 'kodeRombel'})
    Rombel.hasMany(models.Absen, {foreignKey: 'rombelId', sourceKey: 'kodeRombel'})
  };
  // Rombel.associate = function(models) {
  //   // Rombel.hasMany(models.Siswa, {foreignKey: 'kelasId', sourceKey: 'kodeRombel'})
  // }
  return Rombel;
};