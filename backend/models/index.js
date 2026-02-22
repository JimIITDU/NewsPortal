const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  logging: false
});

const User = require('./User')(sequelize);
const Category = require('./Category')(sequelize);
const News = require('./News')(sequelize);
const Comment = require('./Comment')(sequelize);
const Bookmark = require('./Bookmark')(sequelize);
const Like = require('./Like')(sequelize);

// News associations
User.hasMany(News, { foreignKey: 'authorId' });
News.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
Category.hasMany(News, { foreignKey: 'categoryId' });
News.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Comment associations
User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
News.hasMany(Comment, { foreignKey: 'newsId' });
Comment.belongsTo(News, { foreignKey: 'newsId', as: 'news' });

// Bookmark associations
User.hasMany(Bookmark, { foreignKey: 'userId' });
Bookmark.belongsTo(User, { foreignKey: 'userId', as: 'user' });
News.hasMany(Bookmark, { foreignKey: 'newsId' });
Bookmark.belongsTo(News, { foreignKey: 'newsId', as: 'news' });

// Like associations
User.hasMany(Like, { foreignKey: 'userId' });
Like.belongsTo(User, { foreignKey: 'userId', as: 'user' });
News.hasMany(Like, { foreignKey: 'newsId' });
Like.belongsTo(News, { foreignKey: 'newsId', as: 'news' });

module.exports = { sequelize, Sequelize, User, Category, News, Comment, Bookmark, Like };