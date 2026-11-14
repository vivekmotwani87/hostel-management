const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');

// @desc    Apply for room / Create booking request
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { roomId, bedNumber, startDate, endDate, notes } = req.body;
    const studentId = req.user.role === 'admin' && req.body.studentId ? req.body.studentId : req.user._id;

    // Check if student already has an active booking or room
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    if (student.room) {
      return res.status(400).json({
        success: false,
        message: 'Student already has an assigned room. Please vacate first before booking another.',
      });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    if (room.occupied >= room.capacity || room.status === 'Full') {
      return res.status(400).json({ success: false, message: 'Selected room is currently full' });
    }

    if (room.status === 'Maintenance') {
      return res.status(400).json({ success: false, message: 'Selected room is under maintenance' });
    }

    // Check for pending booking
    const existingPending = await Booking.findOne({
      student: studentId,
      status: 'Pending',
    });
    if (existingPending) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending booking application.',
      });
    }

    const booking = await Booking.create({
      student: studentId,
      room: roomId,
      bedNumber: bedNumber || `Bed ${(room.occupied || 0) + 1}`,
      startDate: startDate || new Date(),
      endDate: endDate || null,
      notes: notes || '',
      status: req.user.role === 'admin' ? 'Approved' : 'Pending',
      approvedBy: req.user.role === 'admin' ? req.user._id : null,
    });

    // If admin created it directly, immediately assign room
    if (req.user.role === 'admin') {
      if (!room.occupants.includes(studentId)) {
        room.occupants.push(studentId);
        room.occupied = room.occupants.length;
        await room.save();
      }
      student.room = roomId;
      await student.save();
    }

    const populatedBooking = await Booking.findById(booking._id)
      .populate('student', 'name email phone studentId')
      .populate('room', 'roomNumber block floor type rentPerMonth');

    res.status(201).json({
      success: true,
      message: req.user.role === 'admin' ? 'Room assigned successfully' : 'Booking application submitted',
      booking: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bookings (Admin gets all, Student gets their own)
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res, next) => {
  try {
    const query = {};
    if (req.user.role !== 'admin' && req.user.role !== 'warden') {
      query.student = req.user._id;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    const bookings = await Booking.find(query)
      .populate('student', 'name email phone studentId')
      .populate('room', 'roomNumber block floor type rentPerMonth')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('student', 'name email phone studentId')
      .populate('room', 'roomNumber block floor type rentPerMonth amenities')
      .populate('approvedBy', 'name email');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Ensure student can only view their own booking
    if (
      req.user.role !== 'admin' &&
      req.user.role !== 'warden' &&
      booking.student._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (Approve/Reject)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // 'Approved' or 'Rejected'
    if (!['Approved', 'Rejected', 'Cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const room = await Room.findById(booking.room);
    const student = await User.findById(booking.student);

    if (status === 'Approved') {
      if (room.occupied >= room.capacity) {
        return res.status(400).json({
          success: false,
          message: 'Cannot approve booking: Room is already at full capacity',
        });
      }

      // Add to room occupants if not already
      if (!room.occupants.includes(booking.student)) {
        room.occupants.push(booking.student);
        room.occupied = room.occupants.length;
        await room.save();
      }

      if (student) {
        student.room = room._id;
        await student.save();
      }

      booking.status = 'Approved';
      booking.approvedBy = req.user._id;
    } else if (status === 'Rejected' || status === 'Cancelled') {
      // If was previously approved, remove occupant
      if (booking.status === 'Approved' && room) {
        room.occupants = room.occupants.filter(
          (occ) => occ.toString() !== booking.student.toString()
        );
        room.occupied = room.occupants.length;
        await room.save();

        if (student && student.room?.toString() === room._id.toString()) {
          student.room = null;
          await student.save();
        }
      }

      booking.status = status;
    }

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('student', 'name email phone studentId')
      .populate('room', 'roomNumber block floor type rentPerMonth')
      .populate('approvedBy', 'name email');

    res.json({
      success: true,
      message: `Booking has been ${status.toLowerCase()}`,
      booking: updatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
};

