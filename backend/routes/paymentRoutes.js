const express = require('express');
const { body } = require('express-validator');
const {
  getPayments,
  createPayment,
  getPaymentById,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');

const router = express.Router();

const paymentValidation = [
  body('amount').isFloat({ min: 1 }).withMessage('Payment amount must be greater than zero'),
  validateRequest,
];

router.route('/')
  .get(protect, getPayments)
  .post(protect, paymentValidation, createPayment);

router.route('/:id')
  .get(protect, getPaymentById);

module.exports = router;

