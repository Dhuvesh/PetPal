import mongoose from 'mongoose';

const donationSchema = mongoose.Schema({
  paymentIntentId: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  fundType: {
    type: String,
    required: true,
    enum: ['general', 'medical', 'shelter', 'rescue', 'spay']
  },
  isMonthly: {
    type: Boolean,
    default: false
  },
  subscriptionId: {
    type: String,
    default: null
  },
  message: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Donation = mongoose.model('Donation', donationSchema);

export default Donation;