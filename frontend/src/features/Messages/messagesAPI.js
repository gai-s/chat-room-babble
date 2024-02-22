// A mock function to mimic making an async request for data

export const getMessages = async (socket) => {
  return await socket.emit('get-messages');
};

export const getMessage = async (id, socket) => {
  socket.emit('get-message', id);
};

export const createMessage = async (messageData, socket) => {
  socket.emit('create-message', messageData);
};

export const updateMessage = async (id, messageData, socket) => {
  socket.emit('update-message', id, messageData);
};

export const deleteMessage = async (id, socket) => {
  socket.emit('delete-message', id);
};
