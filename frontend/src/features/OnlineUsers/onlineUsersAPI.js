export const getOnlineUsersCount = async (socket) => {
  return await socket.emit('online-users-count');
};
