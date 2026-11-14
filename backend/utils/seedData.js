const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Complaint = require('../models/Complaint');
const Notice = require('../models/Notice');
const Payment = require('../models/Payment');
const Message = require('../models/Message');

dotenv.config({ path: __dirname + '/../.env' });

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hostel_management';
    await mongoose.connect(mongoUri);
    console.log('[Seeder] Connected to MongoDB at:', mongoUri);

    // Clear existing collections
    await User.deleteMany();
    await Room.deleteMany();
    await Booking.deleteMany();
    await Complaint.deleteMany();
    await Notice.deleteMany();
    await Payment.deleteMany();
    await Message.deleteMany();
    console.log('[Seeder] Cleared previous records.');

    // 1. Create Users
    const admin = await User.create({
      name: 'Hostel Chief Warden',
      email: 'admin@hostel.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 9876543210',
      studentId: 'ADMIN-001',
    });

    const student1 = await User.create({
      name: 'Aarav Sharma',
      email: 'student@hostel.com',
      password: 'student123',
      role: 'student',
      phone: '+91 9123456789',
      studentId: 'STU-2026-101',
      emergencyContact: {
        name: 'Rajesh Sharma',
        phone: '+91 9876501234',
        relation: 'Father',
      },
    });

    const student2 = await User.create({
      name: 'Riya Patel',
      email: 'riya@hostel.com',
      password: 'student123',
      role: 'student',
      phone: '+91 9988776655',
      studentId: 'STU-2026-102',
      emergencyContact: {
        name: 'Sunita Patel',
        phone: '+91 9871122334',
        relation: 'Mother',
      },
    });

    console.log('[Seeder] Created Admin and Student accounts.');

    // 2. Create Rooms
    const rooms = await Room.insertMany([
      {
        roomNumber: 'A-101',
        block: 'Block A',
        floor: 1,
        type: 'Single',
        capacity: 1,
        occupied: 1,
        rentPerMonth: 8500,
        amenities: ['Air Conditioner', 'Attached Washroom', 'Wi-Fi', 'Study Table', 'Balcony', 'Geyser'],
        status: 'Full',
        occupants: [student1._id],
        description: 'Premium single occupant room with private balcony and air conditioning.',
      },
      {
        roomNumber: 'A-102',
        block: 'Block A',
        floor: 1,
        type: 'Double',
        capacity: 2,
        occupied: 1,
        rentPerMonth: 6000,
        amenities: ['Attached Washroom', 'High-Speed Wi-Fi', 'Study Desk', 'Cupboards'],
        status: 'Available',
        occupants: [student2._id],
        description: 'Spacious double sharing room on ground floor with ample natural light.',
      },
      {
        roomNumber: 'A-201',
        block: 'Block A',
        floor: 2,
        type: 'Double',
        capacity: 2,
        occupied: 0,
        rentPerMonth: 6000,
        amenities: ['Attached Washroom', 'Wi-Fi', 'Study Table', 'Cupboards'],
        status: 'Available',
        occupants: [],
        description: 'Quiet corner double room on the second floor facing the garden.',
      },
      {
        roomNumber: 'B-101',
        block: 'Block B',
        floor: 1,
        type: 'Triple',
        capacity: 3,
        occupied: 0,
        rentPerMonth: 4500,
        amenities: ['Wi-Fi', 'Shared Washroom', 'Study Desks', 'Lockers'],
        status: 'Available',
        occupants: [],
        description: 'Economical triple occupancy room with individual study desks and secure lockers.',
      },
      {
        roomNumber: 'B-205',
        block: 'Block B',
        floor: 2,
        type: 'Single',
        capacity: 1,
        occupied: 0,
        rentPerMonth: 8000,
        amenities: ['Attached Washroom', 'Wi-Fi', 'Study Table', 'Cupboard'],
        status: 'Available',
        occupants: [],
        description: 'Peaceful single room suitable for focused studying.',
      },
      {
        roomNumber: 'C-302',
        block: 'Block C',
        floor: 3,
        type: 'Double',
        capacity: 2,
        occupied: 0,
        rentPerMonth: 5500,
        amenities: ['Attached Washroom', 'Wi-Fi', 'Wardrobe', 'Ceiling Fan'],
        status: 'Maintenance',
        occupants: [],
        description: 'Under periodic maintenance and repainting. Will be available next week.',
      },
    ]);

    // Update students assigned rooms
    student1.room = rooms[0]._id;
    await student1.save();

    student2.room = rooms[1]._id;
    await student2.save();

    console.log('[Seeder] Created Rooms and assigned occupants.');

    // 3. Create Bookings
    const booking1 = await Booking.create({
      student: student1._id,
      room: rooms[0]._id,
      bedNumber: 'Bed 1',
      startDate: new Date('2026-01-10'),
      status: 'Approved',
      paymentStatus: 'Paid',
      notes: 'Semester room booking confirmed.',
      approvedBy: admin._id,
    });

    const booking2 = await Booking.create({
      student: student2._id,
      room: rooms[1]._id,
      bedNumber: 'Bed 1',
      startDate: new Date('2026-02-01'),
      status: 'Approved',
      paymentStatus: 'Paid',
      notes: 'Double room sharing confirmed.',
      approvedBy: admin._id,
    });

    console.log('[Seeder] Created Bookings.');

    // 4. Create Complaints
    await Complaint.create([
      {
        student: student1._id,
        room: rooms[0]._id,
        title: 'Geyser heating element issue',
        description: 'The bathroom geyser takes over 30 minutes to heat up water. Please have maintenance inspect it.',
        category: 'Electrical',
        priority: 'High',
        status: 'In Progress',
        assignedTo: 'Rajesh (Electrician)',
        resolutionNote: 'Inspected on Nov 12, replacement thermostat ordered.',
      },
      {
        student: student2._id,
        room: rooms[1]._id,
        title: 'Slow Wi-Fi connectivity in Block A 1st Floor',
        description: 'Wi-Fi connection keeps dropping frequently during evening hours between 8 PM and 10 PM.',
        category: 'Internet',
        priority: 'Medium',
        status: 'Pending',
      },
      {
        student: student1._id,
        room: rooms[0]._id,
        title: 'Study chair caster wheel replaced',
        description: 'One wheel of the study chair was loose and wobbling.',
        category: 'Furniture',
        priority: 'Low',
        status: 'Resolved',
        resolutionNote: 'Replaced with a brand new ergonomic desk chair.',
        resolvedAt: new Date(),
      },
    ]);

    console.log('[Seeder] Created Complaints.');

    // 5. Create Notices
    await Notice.create([
      {
        title: 'Hostel Annual Sports & Cultural Meet 2026',
        content: 'All residents are invited to participate in the Annual Hostel Sports Meet next weekend. Register your teams at the hostel recreation club desk before Friday.',
        category: 'Event',
        priority: 'Important',
        createdBy: admin._id,
        targetAudience: 'All',
        pinned: true,
      },
      {
        title: 'Routine Water Tank Cleaning Schedule',
        content: 'Block A and Block B overhead water tanks will undergo quarterly chemical sanitization on Sunday from 9:00 AM to 1:00 PM. Please store required water in advance.',
        category: 'Maintenance',
        priority: 'Normal',
        createdBy: admin._id,
        targetAudience: 'All',
        pinned: false,
      },
      {
        title: 'Hostel Gate Timing & Visitor Policy Reminder',
        content: 'Curfew time is strictly 10:00 PM for all residents. Outside visitors are only allowed in the common lounge between 4:00 PM and 7:00 PM with gate register entry.',
        category: 'Rules',
        priority: 'Urgent',
        createdBy: admin._id,
        targetAudience: 'All',
        pinned: true,
      },
    ]);

    console.log('[Seeder] Created Notices.');

    // 6. Create Payments
    await Payment.create([
      {
        student: student1._id,
        booking: booking1._id,
        amount: 8500,
        type: 'Rent',
        paymentMethod: 'UPI',
        status: 'Completed',
        transactionId: 'TXN-UPI-98471203',
        invoiceNumber: 'INV-2026-0041',
        billingMonth: 'November 2026',
        paidAt: new Date(),
      },
      {
        student: student2._id,
        booking: booking2._id,
        amount: 6000,
        type: 'Rent',
        paymentMethod: 'Net Banking',
        status: 'Completed',
        transactionId: 'TXN-NET-58301924',
        invoiceNumber: 'INV-2026-0042',
        billingMonth: 'November 2026',
        paidAt: new Date(),
      },
      {
        student: student1._id,
        amount: 2500,
        type: 'Mess Fee',
        paymentMethod: 'UPI',
        status: 'Completed',
        transactionId: 'TXN-UPI-39281720',
        invoiceNumber: 'INV-2026-0043',
        billingMonth: 'November 2026',
        paidAt: new Date(),
      },
    ]);

    console.log('[Seeder] Created Payments.');

    // 7. Create Messages
    await Message.create([
      {
        sender: admin._id,
        message: 'Welcome everyone to the hostel community channel! Feel free to ask questions and coordinate here.',
        channel: 'general',
      },
      {
        sender: student1._id,
        message: 'Hello sir, thanks for the welcome! Could anyone let me know the mess timings for dinner tonight?',
        channel: 'general',
      },
      {
        sender: student2._id,
        message: 'Dinner is served from 7:30 PM to 9:30 PM in the central dining hall!',
        channel: 'general',
      },
    ]);

    console.log('[Seeder] Created Messages.');
    console.log('--------------------------------------------------');
    console.log('Database seeded successfully!');
    console.log('Admin Credentials:   email: admin@hostel.com   | password: admin123');
    console.log('Student Credentials: email: student@hostel.com | password: student123');
    console.log('--------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]:', error);
    process.exit(1);
  }
};

seedDatabase();

