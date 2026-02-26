const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const reporterMiddleware = require('../middlewares/reporterMiddleware');
const { body } = require('express-validator');

const validate = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('categoryId').notEmpty().withMessage('Category is required'),
];

router.get('/', newsController.getAll);
router.get('/my-articles', authMiddleware, reporterMiddleware, newsController.getMyArticles);
router.get('/:id', newsController.getOne);

// both reporters and admins can create
router.post('/', authMiddleware, reporterMiddleware, validate, newsController.create);

// both reporters (own) and admins (any) can update/delete
router.put('/:id', authMiddleware, reporterMiddleware, validate, newsController.update);
router.delete('/:id', authMiddleware, reporterMiddleware, newsController.remove);

module.exports = router;