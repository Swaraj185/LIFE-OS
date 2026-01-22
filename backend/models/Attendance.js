import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  day: {
    type: String,
    required: true,
    enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
  },
  timeSlot: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['present', 'absent', 'late', 'cancelled'],
    default: 'present',
  },
  isExtraClass: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Index to prevent duplicate attendance entries for same subject, date, and timeSlot
attendanceSchema.index({ userId: 1, subject: 1, date: 1, timeSlot: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;

