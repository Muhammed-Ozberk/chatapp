'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Friends', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      firstUserID: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      firstUserName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      secondUserID: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      secondUserName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isFriend: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Friends');
  }
};
