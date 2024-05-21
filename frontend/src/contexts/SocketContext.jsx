import React, { createContext, useState, useEffect } from 'react';
import socket, { initSocket } from '../utils/socket';

const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  useEffect(() => {
    initSocket();
    socket.on('connect', () => setIsSocketConnected(true));
    socket.on('disconnect', () => setIsSocketConnected(false));

    // Cleanup function to disconnect on unmount
    return () => socket.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isSocketConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
