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
        type: Sequelize.STRING(10)
      },
      guruId: {
        type: Sequelize.STRING(30)
      },
      mapelId: {
        type: Sequelize.STRING(60)
      },
      rombelId: {
        type: Sequelize.STRING(20)
      },
      jamke: {
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
    return queryInterface.dropTable('Jadwals');
  }
};