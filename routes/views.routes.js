const router = require('express').Router();
const Event = require('../models/Event');
const { protect } = require('../middlewares/auth.middleware');
const { allowRoles } = require('../middlewares/role.middleware');

// Public / auth
router.get('/', (req, res) => res.redirect('/events'));
router.get('/login', (req, res) => res.render('auth/login', { title: 'Login' }));
router.get('/register', (req, res) => res.render('auth/register', { title: 'Create Account' }));

// Student
router.get('/events', async (req, res, next) => {
  try {
    const events = await Event.find({ status: { $in: ['published', 'ongoing'] } }).sort({ startDate: 1 });
    res.render('student/events-list', { title: 'Events', events });
  } catch (err) {
    next(err);
  }
});

router.get('/events/:id', async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizerId', 'name');
    if (!event) return res.status(404).render('errors/404', { title: 'Event Not Found' });
    res.render('student/event-details', { title: event.title, event });
  } catch (err) {
    next(err);
  }
});

router.get('/dashboard', protect, allowRoles('student'), (req, res) =>
  res.render('student/dashboard', { title: 'My Dashboard' })
);

router.get('/dashboard/certificates', protect, allowRoles('student'), (req, res) =>
  res.render('student/certificates', { title: 'My Certificates' })
);

// Organizer
router.get('/organizer/dashboard', protect, allowRoles('organizer', 'admin'), (req, res) =>
  res.render('organizer/dashboard', { title: 'Organizer Dashboard' })
);

router.get('/organizer/events/new', protect, allowRoles('organizer', 'admin'), (req, res) =>
  res.render('organizer/event-form', { title: 'Create Event', event: null })
);

router.get('/organizer/events/:id/edit', protect, allowRoles('organizer', 'admin'), async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    res.render('organizer/event-form', { title: 'Edit Event', event });
  } catch (err) {
    next(err);
  }
});

router.get('/organizer/events/:id/scan', protect, allowRoles('organizer', 'admin'), (req, res) =>
  res.render('organizer/scanner', { title: 'Scan Attendance', eventId: req.params.id })
);

router.get('/organizer/events/:id/attendees', protect, allowRoles('organizer', 'admin'), (req, res) =>
  res.render('organizer/attendees', { title: 'Attendees', eventId: req.params.id })
);

// Admin
router.get('/admin/dashboard', protect, allowRoles('admin'), (req, res) =>
  res.render('admin/dashboard', { title: 'Admin Dashboard' })
);

module.exports = router;
