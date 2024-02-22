import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/Auth/authSlice';
import messagesReducer from '../features/Messages/MessagesSlice';
import onlineUsersSlice from '../features/OnlineUsers/OnlineUsersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: messagesReducer,
    onlineUsers: onlineUsersSlice,
  },
});
