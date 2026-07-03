const router = require('express').Router();
const dashboardController = require('../../controllers/dashboard.controller');
const { protect } = require('../../middlewares/auth.middleware');
const { allowRoles } = require('../../middlewares/role.middleware');

router.get('/organizer', protect, allowRoles('organizer', 'admin'), dashboardController.organizerDashboard);
router.get('/admin', protect, allowRoles('admin'), dashboardController.adminDashboard);
router.get('/events/:id/export', protect, allowRoles('organizer', 'admin'), dashboardController.exportEventData);

module.exports = router;
