const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    qrCode: { type: String, required: true, unique: true },
    registeredAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['registered', 'cancelled'], default: 'registered' },
  },
  { timestamps: true }
);

// Prevent a student from registering twice for the same event
registrationSchema.index({ eventId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
