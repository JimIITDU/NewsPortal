'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('news', 'views', {
      type: Sequelize.INTEGER, defaultValue: 0, allowNull: false
    });
    await queryInterface.addColumn('news', 'tags', {
      type: Sequelize.STRING, allowNull: true
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('news', 'views');
    await queryInterface.removeColumn('news', 'tags');
  }
};