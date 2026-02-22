const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Like', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    newsId: { type: DataTypes.INTEGER, allowNull: false }
  }, { tableName: 'likes', timestamps: true });
};