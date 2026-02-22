const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Bookmark', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    newsId: { type: DataTypes.INTEGER, allowNull: false }
  }, { tableName: 'bookmarks', timestamps: true });
};