import mongoose from 'mongoose';

const lendingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  personName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['given', 'taken'],
    required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: String,
    required: true,
  },
  returned: {
    type: Boolean,
    default: false,
  },
  returnDate: {
    type: String,
  },
}, {
  timestamps: true,
});

const Lending = mongoose.model('Lending', lendingSchema);

export default Lending;

