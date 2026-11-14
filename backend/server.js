const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const setupSocket = require('./sockets/socketHandler');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const chatRoutes = require('./routes/chatRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS configuration
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Attach socket io setup
setupSocket(io);

// Make io accessible in requests if needed
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Base & Health check routes
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'Hostel Management REST API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Documentation Directory Endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Hostel Management System API',
    version: '1.0.0',
    description: 'Comprehensive REST API for Hostel Operations',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me',
        profile: 'PUT /api/auth/profile',
        allUsers: 'GET /api/auth/users (Admin)',
      },
      rooms: {
        list: 'GET /api/rooms (query: block, type, status, search, minRent, maxRent)',
        getById: 'GET /api/rooms/:id',
        create: 'POST /api/rooms (Admin)',
        update: 'PUT /api/rooms/:id (Admin)',
        delete: 'DELETE /api/rooms/:id (Admin)',
      },
      bookings: {
        list: 'GET /api/bookings',
        create: 'POST /api/bookings',
        getById: 'GET /api/bookings/:id',
        updateStatus: 'PUT /api/bookings/:id/status (Admin)',
      },
      complaints: {
        list: 'GET /api/complaints',
        create: 'POST /api/complaints',
        getById: 'GET /api/complaints/:id',
        updateStatus: 'PUT /api/complaints/:id (Admin)',
        delete: 'DELETE /api/complaints/:id',
      },
      notices: {
        list: 'GET /api/notices',
        create: 'POST /api/notices (Admin)',
        getById: 'GET /api/notices/:id',
        update: 'PUT /api/notices/:id (Admin)',
        delete: 'DELETE /api/notices/:id (Admin)',
      },
      payments: {
        list: 'GET /api/payments',
        create: 'POST /api/payments',
        getById: 'GET /api/payments/:id',
      },
      chat: {
        messages: 'GET /api/chat/:channel',
        send: 'POST /api/chat',
      },
      dashboard: {
        stats: 'GET /api/dashboard/stats',
      },
    },
  });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

// Only listen if not running in test mode
if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`[Hostel Server running]: Port ${PORT} | Mode: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = { app, server };

