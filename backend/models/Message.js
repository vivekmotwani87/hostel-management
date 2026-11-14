const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null means public hostel channel / group chat
    },
    message: {
      type: String,
      required: [true, 'Message cannot be empty'],
      trim: true,
    },
    channel: {
      type: String,
      default: 'general', // 'general', 'announcements', or private room id
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);

