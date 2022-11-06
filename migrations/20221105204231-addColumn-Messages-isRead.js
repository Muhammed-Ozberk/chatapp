'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('Messages', 'isRead', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Messages', 'isRead');
  }
};
