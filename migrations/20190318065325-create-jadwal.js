'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Jadwals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      hari: {
        type: Sequelize.STRING(10),
      },
      kode_guru: Sequelize.STRING(50),
      kode_mapel: Sequelize.STRING(30),
      kode_rombel: Sequelize.STRING(30),
      jamke: Sequelize.STRING(6),
      awal: Sequelize.STRING(20),
      akhir: Sequelize.STRING(20),
      isActive: Sequelize.STRING(2),
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Jadwals');
  }
};