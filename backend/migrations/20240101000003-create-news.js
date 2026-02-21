'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('news', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: Sequelize.STRING, allowNull: false },
      content: { type: Sequelize.TEXT, allowNull: false },
      imageUrl: { type: Sequelize.STRING },
      categoryId: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'categories', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'RESTRICT'
      },
      authorId: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'RESTRICT'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('news');
  }
};