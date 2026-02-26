'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('reporter_applications', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      userId: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE', onDelete: 'CASCADE'
      },
      bio: { type: Sequelize.TEXT, allowNull: false },
      experience: { type: Sequelize.TEXT, allowNull: false },
      portfolioUrl: { type: Sequelize.STRING, allowNull: true },
      topics: { type: Sequelize.STRING, allowNull: false },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
      },
      adminNote: { type: Sequelize.TEXT, allowNull: true },
      reviewedBy: { type: Sequelize.INTEGER, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('reporter_applications');
  }
};