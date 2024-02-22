import socketio from 'socket.io-client';

export const socketClient = (myToken) => {
  const socket = socketio('http://localhost:5000', {
    query: { myToken },
  });
  return socket;
};
