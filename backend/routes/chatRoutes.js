const express = require('express');
const { getMessages, sendMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/:channel')
  .get(protect, getMessages);

router.route('/')
  .post(protect, sendMessage);

module.exports = router;

