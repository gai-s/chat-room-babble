import socketio from 'socket.io-client';

export const socketClient = (myToken) => {
  const socketDestination =
    process.env.NODE_ENV === 'production'
      ? window.location.origin
      : 'http://localhost:5000';
  const socket = socketio(`${socketDestination}`, {
    query: { myToken },
  });
  return socket;
};
