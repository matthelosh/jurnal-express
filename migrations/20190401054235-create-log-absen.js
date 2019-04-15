'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('LogAbsens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      kodeAbsen: {
        type: Sequelize.STRING(60)
      },
      jamke: {
        type: Sequelize.STRING(6)
      },
      tanggal: {
        type: Sequelize.DATE
      },
      rombelId: {
        type: Sequelize.STRING(60)
      },
      guruId: {
        type: Sequelize.STRING(60)
      },
      mapelId: {
        type: Sequelize.STRING(60)
      },
      jmlSiswa: {
        type: Sequelize.INTEGER
      },
      h: {
        type: Sequelize.INTEGER
      },
      i: {
        type: Sequelize.INTEGER
      },
      s: {
        type: Sequelize.INTEGER
      },
      a: {
        type: Sequelize.INTEGER
      },
      t: {
        type: Sequelize.INTEGER
      },
      jurnal: {
        type: Sequelize.STRING(200)
      },
      status: {
        type: Sequelize.STRING(60)
      },
      isActive: {
        type: Sequelize.STRING(10)
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
    return queryInterface.dropTable('LogAbsens');
  }
};