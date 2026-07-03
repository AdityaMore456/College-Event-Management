const router = require('express').Router();
const registrationController = require('../../controllers/registration.controller');
const { protect } = require('../../middlewares/auth.middleware');
const { allowRoles } = require('../../middlewares/role.middleware');

router.post('/events/:id/register', protect, allowRoles('student'), registrationController.registerForEvent);
router.get('/events/:id/registrations', protect, allowRoles('organizer', 'admin'), registrationController.listEventRegistrations);
router.delete('/registrations/:id', protect, allowRoles('student'), registrationController.cancelRegistration);
router.get('/students/:id/registrations', protect, registrationController.myRegistrations);

module.exports = router;
