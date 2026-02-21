const { Comment, User } = require('../models');

exports.getByNews = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { newsId: req.params.newsId },
      include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.create = async (req, res) => {
  const { content } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ message: 'Comment cannot be empty.' });
  }
  try {
    const comment = await Comment.create({
      content: content.trim(),
      userId: req.user.id,
      newsId: req.params.newsId
    });
    const full = await Comment.findByPk(comment.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'name'] }]
    });
    res.status(201).json(full);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found.' });

    const isOwner = comment.userId === req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    await comment.destroy();
    res.json({ message: 'Comment deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};