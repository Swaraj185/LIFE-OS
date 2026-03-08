import mongoose from 'mongoose';

const sleepSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  sleepStartTime: {
    type: String,
    required: true,
  },
  wakeUpTime: {
    type: String,
    required: true,
  },
  totalSleepHours: {
    type: Number,
    required: true,
  },
  quality: {
    type: String,
    enum: ['1', '2', '3', '4', '5', 'Poor', 'Average', 'Good'],
    default: 'Average',
  },
  napDuration: {
    type: Number, // in minutes
    default: 0,
  },
  status: {
    type: String,
    enum: ['Good', 'Low', 'Poor'],
    default: 'Good',
  },
}, {
  timestamps: true,
});

const Sleep = mongoose.model('Sleep', sleepSchema);

export default Sleep;

