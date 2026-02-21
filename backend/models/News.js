const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('News', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    imageUrl: { type: DataTypes.STRING },
    categoryId: { type: DataTypes.INTEGER, allowNull: false },
    authorId: { type: DataTypes.INTEGER, allowNull: false }
  }, { tableName: 'news', timestamps: true });
};