const Room = require('../models/Room');
const User = require('../models/User');

// @desc    Get all rooms with filtering, search, and pagination
// @route   GET /api/rooms
// @access  Public or Protected
const getRooms = async (req, res, next) => {
  try {
    const { block, type, status, search, minRent, maxRent } = req.query;

    const query = {};

    if (block) query.block = block;
    if (type) query.type = type;
    if (status) query.status = status;
    if (minRent || maxRent) {
      query.rentPerMonth = {};
      if (minRent) query.rentPerMonth.$gte = Number(minRent);
      if (maxRent) query.rentPerMonth.$lte = Number(maxRent);
    }
    if (search) {
      query.$or = [
        { roomNumber: { $regex: search, $options: 'i' } },
        { block: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const rooms = await Room.find(query).populate('occupants', 'name email phone studentId');

    res.json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single room by ID
// @route   GET /api/rooms/:id
// @access  Public or Protected
const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate('occupants', 'name email phone studentId');
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    res.json({ success: true, room });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new room
// @route   POST /api/rooms
// @access  Private/Admin
const createRoom = async (req, res, next) => {
  try {
    const { roomNumber, block, floor, type, capacity, rentPerMonth, amenities, description } = req.body;

    const existingRoom = await Room.findOne({ roomNumber: roomNumber.toUpperCase() });
    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: `Room ${roomNumber} already exists`,
      });
    }

    const room = await Room.create({
      roomNumber,
      block,
      floor,
      type,
      capacity,
      rentPerMonth,
      amenities: amenities || ['Attached Washroom', 'Wi-Fi', 'Study Table', 'Cupboard'],
      description,
    });

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update room details
// @route   PUT /api/rooms/:id
// @access  Private/Admin
const updateRoom = async (req, res, next) => {
  try {
    let room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('occupants', 'name email phone studentId');

    res.json({
      success: true,
      message: 'Room updated successfully',
      room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    if (room.occupants && room.occupants.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete room with active occupants. Please reassign occupants first.',
      });
    }

    await Room.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Room deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};

