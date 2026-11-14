const Message = require('../models/Message');

// @desc    Get messages for a channel
// @route   GET /api/chat/:channel
// @access  Private
const getMessages = async (req, res, next) => {
  try {
    const { channel } = req.params;
    const messages = await Message.find({ channel })
      .populate('sender', 'name role avatar')
      .sort({ createdAt: 1 })
      .limit(100);

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message via HTTP
// @route   POST /api/chat
// @access  Private
const sendMessage = async (req, res, next) => {
  try {
    const { message, channel, receiver } = req.body;

    const newMsg = await Message.create({
      sender: req.user._id,
      receiver: receiver || null,
      message,
      channel: channel || 'general',
    });

    const populated = await Message.findById(newMsg._id)
      .populate('sender', 'name role avatar');

    res.status(201).json({
      success: true,
      message: populated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMessages,
  sendMessage,
};

