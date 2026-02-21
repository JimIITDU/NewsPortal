const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.get('/', categoryController.getAll);
router.post('/', authMiddleware, adminMiddleware, categoryController.create);
router.put('/:id', authMiddleware, adminMiddleware, categoryController.update);
router.delete('/:id', authMiddleware, adminMiddleware, categoryController.remove);

module.exports = router;