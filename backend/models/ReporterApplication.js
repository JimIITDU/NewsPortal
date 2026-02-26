const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('ReporterApplication', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    bio: { type: DataTypes.TEXT, allowNull: false },
    experience: { type: DataTypes.TEXT, allowNull: false },
    portfolioUrl: { type: DataTypes.STRING, allowNull: true },
    topics: { type: DataTypes.STRING, allowNull: false },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },
    adminNote: { type: DataTypes.TEXT, allowNull: true },
    reviewedBy: { type: DataTypes.INTEGER, allowNull: true }
  }, { tableName: 'reporter_applications', timestamps: true });
};