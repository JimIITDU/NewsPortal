const { body } = require('express-validator');

exports.newsValidator = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('categoryId').isInt().withMessage('Valid category is required')
];