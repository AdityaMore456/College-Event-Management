const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/events', require('./event.routes'));
router.use('/', require('./registration.routes'));
router.use('/attendance', require('./attendance.routes'));
router.use('/certificates', require('./certificate.routes'));
router.use('/dashboard', require('./dashboard.routes'));

module.exports = router;
