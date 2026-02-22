const { Like } = require('../models');

exports.toggle = async (req, res) => {
  const { newsId } = req.params;
  try {
    const existing = await Like.findOne({
      where: { userId: req.user.id, newsId }
    });
    if (existing) {
      await existing.destroy();
      const count = await Like.count({ where: { newsId } });
      return res.json({ liked: false, count });
    }
    await Like.create({ userId: req.user.id, newsId });
    const count = await Like.count({ where: { newsId } });
    res.json({ liked: true, count });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.getStatus = async (req, res) => {
  const { newsId } = req.params;
  try {
    const count = await Like.count({ where: { newsId } });
    if (req.user) {
      const existing = await Like.findOne({
        where: { userId: req.user.id, newsId }
      });
      return res.json({ liked: !!existing, count });
    }
    res.json({ liked: false, count });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};