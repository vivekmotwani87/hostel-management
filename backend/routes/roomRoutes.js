const express = require('express');
const { body } = require('express-validator');
const {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');

const router = express.Router();

const roomValidation = [
  body('roomNumber').trim().notEmpty().withMessage('Room number is required'),
  body('block').trim().notEmpty().withMessage('Block is required'),
  body('type').isIn(['Single', 'Double', 'Triple', 'Dormitory']).withMessage('Valid room type is required'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  body('rentPerMonth').isFloat({ min: 0 }).withMessage('Rent per month must be a non-negative number'),
  validateRequest,
];

router.route('/')
  .get(getRooms)
  .post(protect, authorize('admin', 'warden'), roomValidation, createRoom);

router.route('/:id')
  .get(getRoomById)
  .put(protect, authorize('admin', 'warden'), updateRoom)
  .delete(protect, authorize('admin', 'warden'), deleteRoom);

module.exports = router;

