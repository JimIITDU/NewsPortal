const { User, News, Comment, Like, Bookmark, Category } = require('../models');
const { Op } = require('sequelize');

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalNews = await News.count();
    const totalComments = await Comment.count();
    const totalLikes = await Like.count();
    const totalBookmarks = await Bookmark.count();
    const totalCategories = await Category.count();

    // Total views across all articles
    const newsWithViews = await News.findAll({ attributes: ['views'] });
    const totalViews = newsWithViews.reduce((sum, n) => sum + (n.views || 0), 0);

    // Most viewed articles
    const topArticles = await News.findAll({
      order: [['views', 'DESC']],
      limit: 5,
      include: [{ model: require('../models').Category, as: 'category', attributes: ['name'] }],
      attributes: ['id', 'title', 'views', 'createdAt']
    });

    // Most liked articles
    const topLiked = await News.findAll({
      limit: 5,
      attributes: ['id', 'title', 'views'],
      order: [['createdAt', 'DESC']]
    });

    // Recent users
    const recentUsers = await User.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5,
      attributes: ['id', 'name', 'email', 'role', 'createdAt']
    });

    // News per category
    const categories = await Category.findAll();
    const newsPerCategory = await Promise.all(
      categories.map(async (c) => ({
        name: c.name,
        count: await News.count({ where: { categoryId: c.id } })
      }))
    );

    res.json({
      totalUsers, totalNews, totalComments,
      totalLikes, totalBookmarks, totalCategories,
      totalViews, topArticles, recentUsers, newsPerCategory
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (user.id === req.user.id) {
      return res.status(400).json({ message: 'You cannot change your own role.' });
    }
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    await user.update({ role: newRole });
    res.json({ message: `User role updated to ${newRole}.`, role: newRole });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (user.id === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete yourself.' });
    }
    await user.destroy();
    res.json({ message: 'User deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};