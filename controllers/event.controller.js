const Event = require('../models/Event');
const Registration = require('../models/Registration');

exports.listEvents = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const events = await Event.find(filter).sort({ startDate: 1 });
    res.status(200).json({ success: true, count: events.length, events });
  } catch (err) {
    next(err);
  }
};

exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizerId', 'name email');
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    const registeredCount = await Registration.countDocuments({ eventId: event._id, status: 'registered' });
    res.status(200).json({ success: true, event, registeredCount });
  } catch (err) {
    next(err);
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    const event = await Event.create({ ...req.body, organizerId: req.user._id });
    res.status(201).json({ success: true, event });
  } catch (err) {
    next(err);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, organizerId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.status(200).json({ success: true, event });
  } catch (err) {
    next(err);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, organizerId: req.user._id },
      { status: 'cancelled' },
      { new: true }
    );
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.status(200).json({ success: true, message: 'Event cancelled', event });
  } catch (err) {
    next(err);
  }
};
