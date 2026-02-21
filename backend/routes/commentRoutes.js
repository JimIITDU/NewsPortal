const express = require('express');
const router = express.Router({ mergeParams: true });
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', commentController.getByNews);
router.post('/', authMiddleware, commentController.create);
router.delete('/:id', authMiddleware, commentController.remove);

module.exports = router;