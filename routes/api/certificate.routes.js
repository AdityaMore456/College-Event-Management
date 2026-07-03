const router = require('express').Router();
const certificateController = require('../../controllers/certificate.controller');
const { protect } = require('../../middlewares/auth.middleware');
const { allowRoles } = require('../../middlewares/role.middleware');

router.post('/events/:id/generate', protect, allowRoles('organizer', 'admin'), certificateController.generateForEvent);
router.get('/students/:id', protect, certificateController.myCertificates);
router.get('/verify/:certificateId', certificateController.verifyCertificate);

module.exports = router;
