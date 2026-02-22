const { News, User, Category, Like } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

const includeOptions = [
  { model: User, as: 'author', attributes: ['id', 'name'] },
  { model: Category, as: 'category', attributes: ['id', 'name'] }
];

exports.getAll = async (req, res) => {
  try {
    const { search, categoryId, tag } = req.query;
    const where = {};
    if (search) where.title = { [Op.like]: `%${search}%` };
    if (categoryId) where.categoryId = categoryId;
    if (tag) where.tags = { [Op.like]: `%${tag}%` };

    const news = await News.findAll({
      where, include: includeOptions,
      order: [['createdAt', 'DESC']]
    });

    const withLikes = await Promise.all(news.map(async (n) => {
      const likeCount = await Like.count({ where: { newsId: n.id } });
      return { ...n.toJSON(), likeCount };
    }));

    res.json(withLikes);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id, { include: includeOptions });
    if (!news) return res.status(404).json({ message: 'News not found.' });

    // Increment views
    await news.increment('views');
    await news.reload();

    const likeCount = await Like.count({ where: { newsId: news.id } });
    res.json({ ...news.toJSON(), likeCount });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { title, content, imageUrl, categoryId, tags } = req.body;
  try {
    const news = await News.create({
      title, content, imageUrl, categoryId,
      tags: tags || null,
      authorId: req.user.id
    });
    res.status(201).json(news);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) return res.status(404).json({ message: 'News not found.' });
    await news.update(req.body);
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) return res.status(404).json({ message: 'News not found.' });
    await news.destroy();
    res.json({ message: 'News deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};