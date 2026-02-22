const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmarkController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, bookmarkController.getMyBookmarks);
router.post('/:newsId/toggle', authMiddleware, bookmarkController.toggle);
router.get('/:newsId/check', authMiddleware, bookmarkController.check);

module.exports = router;