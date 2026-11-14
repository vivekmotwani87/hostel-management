const Message = require('../models/Message');

const setupSocket = (io) => {
  // Store connected users: userId -> socketId
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log(`[Socket Connected]: ${socket.id}`);

    // User authentication / identification on socket
    socket.on('user_online', (userData) => {
      if (userData && userData._id) {
        onlineUsers.set(userData._id, socket.id);
        io.emit('online_users_count', onlineUsers.size);
        console.log(`User registered online: ${userData.name} (${userData._id})`);
      }
    });

    // Join a room/channel (e.g. 'general', 'notices', or specific room)
    socket.on('join_channel', (channelName) => {
      socket.join(channelName);
      console.log(`Socket ${socket.id} joined channel: ${channelName}`);
    });

    // Leave a room/channel
    socket.on('leave_channel', (channelName) => {
      socket.leave(channelName);
      console.log(`Socket ${socket.id} left channel: ${channelName}`);
    });

    // Real-time Chat message
    socket.on('send_message', async (data) => {
      try {
        const { senderId, message, channel, receiverId } = data;

        const newMsg = await Message.create({
          sender: senderId,
          receiver: receiverId || null,
          message,
          channel: channel || 'general',
        });

        const populatedMsg = await Message.findById(newMsg._id).populate(
          'sender',
          'name role avatar'
        );

        // Emit to channel
        io.to(channel || 'general').emit('receive_message', populatedMsg);
      } catch (err) {
        console.error('Socket message error:', err.message);
        socket.emit('socket_error', { message: 'Failed to send message' });
      }
    });

    // Typing indicators
    socket.on('typing', ({ channel, user }) => {
      socket.to(channel).emit('user_typing', { user });
    });

    socket.on('stop_typing', ({ channel }) => {
      socket.to(channel).emit('user_stop_typing');
    });

    // Real-time notification broadcasts
    socket.on('broadcast_notice', (notice) => {
      io.emit('new_notice_broadcast', notice);
    });

    socket.on('complaint_status_change', (complaint) => {
      io.emit('complaint_updated', complaint);
    });

    socket.on('booking_status_change', (booking) => {
      io.emit('booking_updated', booking);
    });

    // Disconnect handling
    socket.on('disconnect', () => {
      for (const [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      io.emit('online_users_count', onlineUsers.size);
      console.log(`[Socket Disconnected]: ${socket.id}`);
    });
  });
};

module.exports = setupSocket;

