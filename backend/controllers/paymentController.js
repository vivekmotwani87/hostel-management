const Payment = require('../models/Payment');

// @desc    Get payments
// @route   GET /api/payments
// @access  Private
const getPayments = async (req, res, next) => {
  try {
    const query = {};
    if (req.user.role !== 'admin' && req.user.role !== 'warden') {
      query.student = req.user._id;
    }

    if (req.query.status) query.status = req.query.status;
    if (req.query.type) query.type = req.query.type;

    const payments = await Payment.find(query)
      .populate('student', 'name email phone studentId')
      .populate('booking')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Make/Record payment
// @route   POST /api/payments
// @access  Private
const createPayment = async (req, res, next) => {
  try {
    const { amount, type, paymentMethod, billingMonth, bookingId } = req.body;
    const studentId = req.user.role === 'admin' && req.body.studentId ? req.body.studentId : req.user._id;

    const txId = 'TXN-' + Date.now() + '-' + Math.floor(1000 + Math.random() * 9000);
    const invoiceNum = 'INV-' + new Date().getFullYear() + '-' + Math.floor(10000 + Math.random() * 90000);

    const payment = await Payment.create({
      student: studentId,
      booking: bookingId || null,
      amount,
      type: type || 'Rent',
      paymentMethod: paymentMethod || 'UPI',
      status: 'Completed',
      transactionId: txId,
      invoiceNumber: invoiceNum,
      billingMonth: billingMonth || new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
      paidAt: new Date(),
    });

    const populated = await Payment.findById(payment._id)
      .populate('student', 'name email phone studentId');

    res.status(201).json({
      success: true,
      message: 'Payment processed successfully',
      payment: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single payment receipt
// @route   GET /api/payments/:id
// @access  Private
const getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('student', 'name email phone studentId room')
      .populate('booking');

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    if (
      req.user.role !== 'admin' &&
      req.user.role !== 'warden' &&
      payment.student._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, payment });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPayments,
  createPayment,
  getPaymentById,
};

