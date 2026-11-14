const Notice = require('../models/Notice');

// @desc    Get all notices
// @route   GET /api/notices
// @access  Public/Private
const getNotices = async (req, res, next) => {
  try {
    const { category, priority } = req.query;
    const query = {};

    if (category) query.category = category;
    if (priority) query.priority = priority;

    const notices = await Notice.find(query)
      .populate('createdBy', 'name email role')
      .sort({ pinned: -1, createdAt: -1 });

    res.json({
      success: true,
      count: notices.length,
      notices,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single notice
// @route   GET /api/notices/:id
// @access  Public/Private
const getNoticeById = async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id).populate('createdBy', 'name email role');
    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }
    res.json({ success: true, notice });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new notice
// @route   POST /api/notices
// @access  Private/Admin
const createNotice = async (req, res, next) => {
  try {
    const { title, content, category, priority, targetAudience, pinned } = req.body;

    const notice = await Notice.create({
      title,
      content,
      category: category || 'General',
      priority: priority || 'Normal',
      targetAudience: targetAudience || 'All',
      pinned: pinned || false,
      createdBy: req.user._id,
    });

    const populated = await Notice.findById(notice._id).populate('createdBy', 'name email role');

    res.status(201).json({
      success: true,
      message: 'Notice broadcasted successfully',
      notice: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update notice
// @route   PUT /api/notices/:id
// @access  Private/Admin
const updateNotice = async (req, res, next) => {
  try {
    let notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }

    notice = await Notice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('createdBy', 'name email role');

    res.json({
      success: true,
      message: 'Notice updated successfully',
      notice,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete notice
// @route   DELETE /api/notices/:id
// @access  Private/Admin
const deleteNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }

    await Notice.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Notice deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
};

