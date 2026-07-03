const router = require('express').Router();
const attendanceController = require('../../controllers/attendance.controller');
const { protect } = require('../../middlewares/auth.middleware');
const { allowRoles } = require('../../middlewares/role.middleware');

router.post('/scan', protect, allowRoles('organizer', 'admin'), attendanceController.scanQr);
router.post('/manual', protect, allowRoles('organizer', 'admin'), attendanceController.markManual);
router.get('/events/:id', protect, allowRoles('organizer', 'admin'), attendanceController.eventAttendance);

module.exports = router;
