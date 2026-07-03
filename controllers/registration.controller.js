const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { generateQrToken, generateQrImage } = require('../utils/qr');

exports.registerForEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    if (new Date() > new Date(event.registrationDeadline)) {
      return res.status(400).json({ success: false, message: 'Registration deadline has passed' });
    }

    const registeredCount = await Registration.countDocuments({ eventId: event._id, status: 'registered' });
    if (registeredCount >= event.capacity) {
      return res.status(400).json({ success: false, message: 'Event has reached full capacity' });
    }

    const qrCode = generateQrToken();
    const registration = await Registration.create({
      eventId: event._id,
      studentId: req.user._id,
      qrCode,
    });

    const qrImage = await generateQrImage(qrCode);
    res.status(201).json({ success: true, registration, qrImage });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'You are already registered for this event' });
    }
    next(err);
  }
};

exports.listEventRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ eventId: req.params.id, status: 'registered' })
      .populate('studentId', 'name email collegeId department');
    res.status(200).json({ success: true, count: registrations.length, registrations });
  } catch (err) {
    next(err);
  }
};

exports.cancelRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findOneAndUpdate(
      { _id: req.params.id, studentId: req.user._id },
      { status: 'cancelled' },
      { new: true }
    );
    if (!registration) return res.status(404).json({ success: false, message: 'Registration not found' });
    res.status(200).json({ success: true, message: 'Registration cancelled' });
  } catch (err) {
    next(err);
  }
};

exports.myRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ studentId: req.params.id, status: 'registered' })
      .populate('eventId');
    res.status(200).json({ success: true, registrations });
  } catch (err) {
    next(err);
  }
};
