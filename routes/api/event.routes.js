const router = require('express').Router();
const eventController = require('../../controllers/event.controller');
const { protect } = require('../../middlewares/auth.middleware');
const { allowRoles } = require('../../middlewares/role.middleware');

router.get('/', eventController.listEvents);
router.get('/:id', eventController.getEvent);
router.post('/', protect, allowRoles('organizer', 'admin'), eventController.createEvent);
router.put('/:id', protect, allowRoles('organizer', 'admin'), eventController.updateEvent);
router.delete('/:id', protect, allowRoles('organizer', 'admin'), eventController.deleteEvent);

module.exports = router;
