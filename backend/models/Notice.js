const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide notice title'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Please provide notice content'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['General', 'Maintenance', 'Event', 'Urgent', 'Rules', 'Mess'],
      default: 'General',
    },
    priority: {
      type: String,
      enum: ['Normal', 'Important', 'Urgent'],
      default: 'Normal',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetAudience: {
      type: String,
      enum: ['All', 'Block A', 'Block B', 'Block C'],
      default: 'All',
    },
    pinned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notice', noticeSchema);

