'use strict';
module.exports = (sequelize, DataTypes) => {
  const Siswa = sequelize.define('Siswa', {
    nis: DataTypes.STRING,
    namaSiswa: DataTypes.STRING,
    kelasId: DataTypes.STRING,
    hp: DataTypes.STRING
  }, {});
  Siswa.associate = function(models) {
    // associations can be defined here
    Siswa.belongsTo(models.Rombel, {foreignKey: 'kelasId', targetKey:'kodeRombel'})
  };

  Siswa.hapus = (id) => {
    return new Promise((resolve, reject) => {
      Siswa.destroy({where: {id:id}}).then(del => {
        if (del) {
          resolve('Siswa dengan id: '+id+' telah dihapus.')
        } else {
          reject('gagal menghapus Siswa dengan id: '+id)
        }
      })
    })
  }
  return Siswa;
};