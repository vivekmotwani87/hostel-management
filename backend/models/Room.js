const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, 'Please provide a room number'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    block: {
      type: String,
      required: [true, 'Please specify the block or wing (e.g. Block A)'],
      trim: true,
    },
    floor: {
      type: Number,
      required: [true, 'Please specify floor number'],
      default: 1,
    },
    type: {
      type: String,
      enum: ['Single', 'Double', 'Triple', 'Dormitory'],
      required: [true, 'Please choose room type'],
      default: 'Double',
    },
    capacity: {
      type: Number,
      required: [true, 'Please set room capacity'],
      min: [1, 'Capacity must be at least 1'],
    },
    occupied: {
      type: Number,
      default: 0,
      min: 0,
    },
    rentPerMonth: {
      type: Number,
      required: [true, 'Please specify monthly rent'],
      min: 0,
    },
    amenities: {
      type: [String],
      default: ['Attached Washroom', 'Wi-Fi', 'Study Table', 'Cupboard'],
    },
    status: {
      type: String,
      enum: ['Available', 'Full', 'Maintenance'],
      default: 'Available',
    },
    occupants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    description: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Auto-update status based on occupants
roomSchema.pre('save', function (next) {
  if (this.occupied >= this.capacity) {
    this.status = 'Full';
  } else if (this.status !== 'Maintenance') {
    this.status = 'Available';
  }
  next();
});

module.exports = mongoose.model('Room', roomSchema);

