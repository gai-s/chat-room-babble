// A mock function to mimic making an async request for data

export const getOnlineUsersCount = async (socket) => {
  return await socket.emit('online-users-count');
};
