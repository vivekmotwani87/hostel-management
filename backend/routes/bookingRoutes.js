const express = require('express');
const { body } = require('express-validator');
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');

const router = express.Router();

const bookingValidation = [
  body('roomId').notEmpty().withMessage('Room ID is required'),
  validateRequest,
];

router.route('/')
  .get(protect, getBookings)
  .post(protect, bookingValidation, createBooking);

router.route('/:id')
  .get(protect, getBookingById);

router.route('/:id/status')
  .put(protect, authorize('admin', 'warden'), updateBookingStatus);

module.exports = router;

