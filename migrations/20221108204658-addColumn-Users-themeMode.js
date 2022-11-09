'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('Users', 'themeMode', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "light"
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Users', 'themeMode');
  }
};
