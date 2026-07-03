const Registration = require('../models/Registration');
const Attendance = require('../models/Attendance');

exports.scanQr = async (req, res, next) => {
  try {
    const { qrCode } = req.body;
    const registration = await Registration.findOne({ qrCode, status: 'registered' }).populate('studentId', 'name profileImage');
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Invalid or unrecognized QR code' });
    }

    const existing = await Attendance.findOne({ registrationId: registration._id });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Already checked in',
        checkedInAt: existing.checkedInAt,
      });
    }

    const attendance = await Attendance.create({
      registrationId: registration._id,
      eventId: registration.eventId,
      studentId: registration.studentId._id,
      markedBy: req.user._id,
      method: 'qr',
    });

    res.status(201).json({ success: true, message: 'Attendance marked', student: registration.studentId, attendance });
  } catch (err) {
    next(err);
  }
};

exports.markManual = async (req, res, next) => {
  try {
    const { registrationId } = req.body;
    const registration = await Registration.findById(registrationId);
    if (!registration) return res.status(404).json({ success: false, message: 'Registration not found' });

    const attendance = await Attendance.findOneAndUpdate(
      { registrationId },
      {
        registrationId,
        eventId: registration.eventId,
        studentId: registration.studentId,
        markedBy: req.user._id,
        method: 'manual',
        checkedInAt: new Date(),
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, attendance });
  } catch (err) {
    next(err);
  }
};

exports.eventAttendance = async (req, res, next) => {
  try {
    const records = await Attendance.find({ eventId: req.params.id }).populate('studentId', 'name email');
    res.status(200).json({ success: true, count: records.length, attendance: records });
  } catch (err) {
    next(err);
  }
};
