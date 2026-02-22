const { Bookmark, News, User, Category } = require('../models');

exports.getMyBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.findAll({
      where: { userId: req.user.id },
      include: [{
        model: News, as: 'news',
        include: [
          { model: User, as: 'author', attributes: ['id', 'name'] },
          { model: Category, as: 'category', attributes: ['id', 'name'] }
        ]
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.toggle = async (req, res) => {
  const { newsId } = req.params;
  try {
    const existing = await Bookmark.findOne({
      where: { userId: req.user.id, newsId }
    });
    if (existing) {
      await existing.destroy();
      return res.json({ bookmarked: false });
    }
    await Bookmark.create({ userId: req.user.id, newsId });
    res.json({ bookmarked: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.check = async (req, res) => {
  const { newsId } = req.params;
  try {
    const existing = await Bookmark.findOne({
      where: { userId: req.user.id, newsId }
    });
    res.json({ bookmarked: !!existing });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};