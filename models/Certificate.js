const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    certificateId: { type: String, required: true, unique: true },
    fileUrl: { type: String, required: true },
    issuedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

certificateSchema.index({ eventId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Certificate', certificateSchema);
