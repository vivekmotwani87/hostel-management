import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineCount, setOnlineCount] = useState(1);
  const { user } = useAuth();

  useEffect(() => {
    // Connect to backend socket
    const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin;
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('[Socket connected]:', newSocket.id);
      if (user) {
        newSocket.emit('user_online', user);
      }
    });

    newSocket.on('online_users_count', (count) => {
      setOnlineCount(count);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // When user updates, broadcast online identity
  useEffect(() => {
    if (socket && user) {
      socket.emit('user_online', user);
    }
  }, [socket, user]);

  return (
    <SocketContext.Provider value={{ socket, onlineCount }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

