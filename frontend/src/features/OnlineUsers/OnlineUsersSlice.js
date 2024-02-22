import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  onlineUsers: [],
  errorMessage: '',
};

// export const asyncOnlineUsersCount = createAsyncThunk(
//   'users/getOnlineUsersCount',
//   async (socket, thunkAPI) => {
//     try {
//       await getOnlineUsersCount(socket);
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         (error.response && error.response.message) || error.message
//       );
//     }
//   }
// );

const onlineUsersSlice = createSlice({
  name: 'onlineUsers',
  initialState,
  reducers: {
    socketGetOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
  // extraReducers: (builder) => {
  //   builder.addCase(asyncOnlineUsers.rejected, (state, action) => {
  //     state.errorMessage = action.payload;
  //   });
  // },
});

export const { socketGetOnlineUsers } = onlineUsersSlice.actions;
export default onlineUsersSlice.reducer;
