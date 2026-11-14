const express = require('express');
const { body } = require('express-validator');
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');

const router = express.Router();

const complaintValidation = [
  body('title').trim().notEmpty().withMessage('Complaint title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  validateRequest,
];

router.route('/')
  .get(protect, getComplaints)
  .post(protect, complaintValidation, createComplaint);

router.route('/:id')
  .get(protect, getComplaintById)
  .put(protect, authorize('admin', 'warden'), updateComplaint)
  .delete(protect, deleteComplaint);

module.exports = router;

