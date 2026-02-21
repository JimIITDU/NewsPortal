const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const { newsValidator } = require('../validators/newsValidator');

router.get('/', newsController.getAll);
router.get('/:id', newsController.getOne);
router.post('/', authMiddleware, adminMiddleware, newsValidator, newsController.create);
router.put('/:id', authMiddleware, adminMiddleware, newsValidator, newsController.update);
router.delete('/:id', authMiddleware, adminMiddleware, newsController.remove);

module.exports = router;