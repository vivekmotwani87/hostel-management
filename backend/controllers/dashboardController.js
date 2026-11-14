const Room = require('../models/Room');
const User = require('../models/User');
const Complaint = require('../models/Complaint');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Notice = require('../models/Notice');

// @desc    Get dashboard metrics & summary
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin' || req.user.role === 'warden';

    if (isAdmin) {
      const [
        totalRooms,
        totalStudents,
        pendingBookings,
        pendingComplaints,
        resolvedComplaints,
        noticesCount,
        payments,
      ] = await Promise.all([
        Room.find(),
        User.countDocuments({ role: 'student' }),
        Booking.countDocuments({ status: 'Pending' }),
        Complaint.countDocuments({ status: 'Pending' }),
        Complaint.countDocuments({ status: 'Resolved' }),
        Notice.countDocuments(),
        Payment.find({ status: 'Completed' }),
      ]);

      const totalBeds = totalRooms.reduce((acc, r) => acc + (r.capacity || 0), 0);
      const occupiedBeds = totalRooms.reduce((acc, r) => acc + (r.occupied || 0), 0);
      const availableBeds = Math.max(0, totalBeds - occupiedBeds);
      const totalRevenue = payments.reduce((acc, p) => acc + (p.amount || 0), 0);

      const recentBookings = await Booking.find()
        .populate('student', 'name email studentId')
        .populate('room', 'roomNumber block')
        .sort({ createdAt: -1 })
        .limit(5);

      const recentComplaints = await Complaint.find()
        .populate('student', 'name email')
        .populate('room', 'roomNumber block')
        .sort({ createdAt: -1 })
        .limit(5);

      return res.json({
        success: true,
        stats: {
          totalRooms: totalRooms.length,
          totalBeds,
          occupiedBeds,
          availableBeds,
          occupancyRate: totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0,
          totalStudents,
          pendingBookings,
          pendingComplaints,
          resolvedComplaints,
          noticesCount,
          totalRevenue,
        },
        recentBookings,
        recentComplaints,
      });
    } else {
      // Student dashboard
      const [myBookings, myComplaints, myPayments, latestNotices, myRoom] = await Promise.all([
        Booking.find({ student: req.user._id }).populate('room').sort({ createdAt: -1 }),
        Complaint.find({ student: req.user._id }).sort({ createdAt: -1 }),
        Payment.find({ student: req.user._id }).sort({ createdAt: -1 }),
        Notice.find().sort({ pinned: -1, createdAt: -1 }).limit(5),
        req.user.room ? Room.findById(req.user.room).populate('occupants', 'name email phone') : null,
      ]);

      return res.json({
        success: true,
        stats: {
          assignedRoom: myRoom,
          totalBookings: myBookings.length,
          activeBookings: myBookings.filter((b) => b.status === 'Approved').length,
          pendingComplaints: myComplaints.filter((c) => c.status === 'Pending').length,
          resolvedComplaints: myComplaints.filter((c) => c.status === 'Resolved').length,
          totalPaid: myPayments.reduce((acc, p) => acc + (p.amount || 0), 0),
        },
        myBookings: myBookings.slice(0, 5),
        myComplaints: myComplaints.slice(0, 5),
        myPayments: myPayments.slice(0, 5),
        latestNotices,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};

