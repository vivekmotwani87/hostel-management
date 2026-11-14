const express = require('express');
const { body } = require('express-validator');
const {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
} = require('../controllers/noticeController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');

const router = express.Router();

const noticeValidation = [
  body('title').trim().notEmpty().withMessage('Notice title is required'),
  body('content').trim().notEmpty().withMessage('Notice content is required'),
  validateRequest,
];

router.route('/')
  .get(getNotices)
  .post(protect, authorize('admin', 'warden'), noticeValidation, createNotice);

router.route('/:id')
  .get(getNoticeById)
  .put(protect, authorize('admin', 'warden'), updateNotice)
  .delete(protect, authorize('admin', 'warden'), deleteNotice);

module.exports = router;

