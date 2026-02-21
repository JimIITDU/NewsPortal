const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Comment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    content: { type: DataTypes.TEXT, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    newsId: { type: DataTypes.INTEGER, allowNull: false }
  }, { tableName: 'comments', timestamps: true });
};