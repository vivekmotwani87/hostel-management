const Complaint = require('../models/Complaint');

// @desc    File a new complaint
// @route   POST /api/complaints
// @access  Private
const createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, priority, roomId } = req.body;

    const complaint = await Complaint.create({
      student: req.user._id,
      room: roomId || req.user.room || null,
      title,
      description,
      category: category || 'Other',
      priority: priority || 'Medium',
      status: 'Pending',
    });

    const populated = await Complaint.findById(complaint._id)
      .populate('student', 'name email phone studentId')
      .populate('room', 'roomNumber block');

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      complaint: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all complaints (Admin) or my complaints (Student)
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res, next) => {
  try {
    const query = {};
    if (req.user.role !== 'admin' && req.user.role !== 'warden') {
      query.student = req.user._id;
    }

    if (req.query.status) query.status = req.query.status;
    if (req.query.category) query.category = req.query.category;
    if (req.query.priority) query.priority = req.query.priority;

    const complaints = await Complaint.find(query)
      .populate('student', 'name email phone studentId')
      .populate('room', 'roomNumber block')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('student', 'name email phone studentId')
      .populate('room', 'roomNumber block');

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (
      req.user.role !== 'admin' &&
      req.user.role !== 'warden' &&
      complaint.student._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, complaint });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status or resolution note
// @route   PUT /api/complaints/:id
// @access  Private/Admin
const updateComplaint = async (req, res, next) => {
  try {
    const { status, resolutionNote, assignedTo, priority } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (status) complaint.status = status;
    if (resolutionNote !== undefined) complaint.resolutionNote = resolutionNote;
    if (assignedTo !== undefined) complaint.assignedTo = assignedTo;
    if (priority) complaint.priority = priority;

    if (status === 'Resolved') {
      complaint.resolvedAt = new Date();
    }

    await complaint.save();

    const updated = await Complaint.findById(complaint._id)
      .populate('student', 'name email phone studentId')
      .populate('room', 'roomNumber block');

    res.json({
      success: true,
      message: 'Complaint updated successfully',
      complaint: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private
const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (
      req.user.role !== 'admin' &&
      complaint.student.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    await Complaint.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Complaint deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
};

