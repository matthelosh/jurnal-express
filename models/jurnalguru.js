'use strict';
module.exports = (sequelize, DataTypes) => {
  const JurnalGuru = sequelize.define('JurnalGuru', {
    guruId: DataTypes.STRING,
    // tanggal: DataTypes.STRING,
    mulai: DataTypes.STRING,
    selesai: DataTypes.STRING,
    lokasi: DataTypes.STRING,
    kegiatan: DataTypes.STRING,
    uraian: DataTypes.STRING
  }, {});
  JurnalGuru.associate = function(models) {
    // associations can be defined here
    JurnalGuru.belongsTo(models.User,{foreignKey: 'guruId', targetKey: 'userid'})
  };
  return JurnalGuru;
};