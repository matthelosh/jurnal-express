'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('JurnalGurus', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      guruId: {
        type: Sequelize.STRING(60)
      },
      tanggal: {
        type: Sequelize.STRING(10)
      },
      mulai: {
        type: Sequelize.STRING(10)
      },
      selesai: {
        type: Sequelize.STRING(10)
      },
      lokasi: {
        type: Sequelize.STRING(60)
      },
      kegiatan: {
        type: Sequelize.STRING
      },
      uraian: {
        type: Sequelize.TEXT
      },
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
    return queryInterface.dropTable('JurnalGurus');
  }
};