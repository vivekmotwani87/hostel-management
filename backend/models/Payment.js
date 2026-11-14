const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
    amount: {
      type: Number,
      required: [true, 'Please provide payment amount'],
      min: [1, 'Amount must be greater than 0'],
    },
    type: {
      type: String,
      enum: ['Rent', 'Security Deposit', 'Mess Fee', 'Maintenance Fee', 'Late Fee'],
      default: 'Rent',
    },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash'],
      default: 'UPI',
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
      default: 'Completed',
    },
    transactionId: {
      type: String,
      unique: true,
      required: true,
    },
    invoiceNumber: {
      type: String,
      unique: true,
      required: true,
    },
    billingMonth: {
      type: String,
      required: true,
    },
    paidAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);

