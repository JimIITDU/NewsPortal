const express = require('express');
const router = express.Router();
const controller = require('../controllers/ReporterApplicationController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.post('/apply', authMiddleware, controller.apply);
router.get('/my-application', authMiddleware, controller.getMyApplication);
router.get('/admin/all', authMiddleware, adminMiddleware, controller.getAllApplications);
router.put('/admin/:id/review', authMiddleware, adminMiddleware, controller.review);

module.exports = router;