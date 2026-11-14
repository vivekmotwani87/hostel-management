const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
    },
    title: {
      type: String,
      required: [true, 'Please provide complaint title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please describe your complaint in detail'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Plumbing', 'Electrical', 'Furniture', 'Cleanliness', 'Internet', 'Mess', 'Other'],
      default: 'Other',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Pending',
    },
    assignedTo: {
      type: String,
      default: 'Maintenance Staff',
    },
    resolutionNote: {
      type: String,
      default: '',
    },
    resolvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Complaint', complaintSchema);

