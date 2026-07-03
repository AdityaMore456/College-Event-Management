const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Attendance = require('../models/Attendance');
const { Parser } = require('json2csv');

exports.organizerDashboard = async (req, res, next) => {
  try {
    const events = await Event.find({ organizerId: req.user._id });
    const eventIds = events.map((e) => e._id);

    const totalRegistrations = await Registration.countDocuments({ eventId: { $in: eventIds }, status: 'registered' });
    const totalAttendance = await Attendance.countDocuments({ eventId: { $in: eventIds } });

    res.status(200).json({
      success: true,
      stats: { totalEvents: events.length, totalRegistrations, totalAttendance },
      events,
    });
  } catch (err) {
    next(err);
  }
};

exports.adminDashboard = async (req, res, next) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalRegistrations = await Registration.countDocuments({ status: 'registered' });
    const totalAttendance = await Attendance.countDocuments();

    res.status(200).json({
      success: true,
      stats: { totalEvents, totalRegistrations, totalAttendance },
    });
  } catch (err) {
    next(err);
  }
};

exports.exportEventData = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ eventId: req.params.id })
      .populate('studentId', 'name email collegeId department');

    const rows = registrations.map((r) => ({
      name: r.studentId.name,
      email: r.studentId.email,
      collegeId: r.studentId.collegeId,
      department: r.studentId.department,
      status: r.status,
      registeredAt: r.registeredAt,
    }));

    const parser = new Parser();
    const csv = parser.parse(rows);

    res.header('Content-Type', 'text/csv');
    res.attachment(`event-${req.params.id}-registrations.csv`);
    res.send(csv);
  } catch (err) {
    next(err);
  }
};
