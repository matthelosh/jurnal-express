'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Absens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      kodeAbsen: {
        type: Sequelize.STRING
      },
      tanggal: {
        type: Sequelize.STRING
      },
      jamke: {
        type: Sequelize.STRING
      },
      siswaId: {
        type: Sequelize.STRING
      },
      guruId: {
        type: Sequelize.STRING
      },
      mapelId: {
        type: Sequelize.STRING
      },
      rombelId: {
        type: Sequelize.STRING
      },
      ket: {
        type: Sequelize.STRING
      },
      jurnal: {
        type: Sequelize.STRING
      },
      isValid: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('Absens');
  }
};