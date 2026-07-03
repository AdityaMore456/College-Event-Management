const Event = require('../models/Event');
const Attendance = require('../models/Attendance');
const Certificate = require('../models/Certificate');
const { generateCertificatePdf } = require('../utils/certificate');

exports.generateForEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizerId', 'name');
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    const attendees = await Attendance.find({ eventId: event._id }).populate('studentId', 'name');
    const results = [];

    for (const record of attendees) {
      const already = await Certificate.findOne({ eventId: event._id, studentId: record.studentId._id });
      if (already) {
        results.push(already);
        continue;
      }

      const { certificateId, fileUrl } = generateCertificatePdf({
        studentName: record.studentId.name,
        eventTitle: event.title,
        eventDate: event.startDate.toDateString(),
        organizerName: event.organizerId.name,
      });

      const cert = await Certificate.create({
        eventId: event._id,
        studentId: record.studentId._id,
        certificateId,
        fileUrl,
      });
      results.push(cert);
    }

    res.status(200).json({ success: true, count: results.length, certificates: results });
  } catch (err) {
    next(err);
  }
};

exports.myCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find({ studentId: req.params.id }).populate('eventId', 'title startDate');
    res.status(200).json({ success: true, certificates });
  } catch (err) {
    next(err);
  }
};

exports.verifyCertificate = async (req, res, next) => {
  try {
    const cert = await Certificate.findOne({ certificateId: req.params.certificateId })
      .populate('studentId', 'name')
      .populate('eventId', 'title startDate');
    if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found' });
    res.status(200).json({ success: true, certificate: cert });
  } catch (err) {
    next(err);
  }
};
