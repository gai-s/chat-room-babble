import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getMessages,
  createMessage,
  updateMessage,
  deleteMessage,
  sendFeedback,
} from './messagesAPI';

const initialState = {
  messages: [],
  message: {},
  feedback: '',
  errorMessage: '',
  isLoading: false,
};

export const asyncGetMessages = createAsyncThunk(
  'messages/getMessages',
  async (socket, thunkAPI) => {
    try {
      await getMessages(socket);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error.response && error.response.message) || error.message
      );
    }
  }
);
export const asyncSendFeedback = createAsyncThunk(
  'messages/sendFeedback',
  async ({ socket, message }, thunkAPI) => {
    try {
      sendFeedback(message, socket);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error.response && error.response.message) || error.message
      );
    }
  }
);

export const asyncCreateMessage = createAsyncThunk(
  'messages/create',
  async ({ socket, content }, thunkAPI) => {
    try {
      createMessage({ content }, socket);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error.response && error.response.message) || error.message
      );
    }
  }
);

export const asyncUpdateMessage = createAsyncThunk(
  'messages/updateMessage',
  async ({ socket, id, content }, thunkAPI) => {
    try {
      updateMessage(id, { content }, socket);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error.response && error.response.message) ||
          error?.message ||
          'unrecognized error'
      );
    }
  }
);

export const asyncDeleteMessage = createAsyncThunk(
  'messages/deleteMessage',
  async ({ socket, id }, thunkAPI) => {
    try {
      deleteMessage(id, socket);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error.response.data && error.response.data.message) || error.message
      );
    }
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    unsetIsLoading: (state) => {
      state.isLoading = false;
    },
    socketGetMessages: (state, action) => {
      state.isLoading = false;
      state.messages = action.payload;
    },
    socketGetMessage: (state, action) => {
      if (
        state.messages.filter((message) => message._id === action.payload._id)
          .length === 0
      )
        state.messages = [...state.messages, action.payload];
    },
    socketUpdateMessage: (state, action) => {
      state.messages = state.messages.map((message) =>
        message._id === action.payload._id ? action.payload : message
      );
    },
    socketDeleteMessage: (state, action) => {
      state.messages = state.messages.filter(
        (message) => message._id !== action.payload
      );
    },
    socketGetFeedback: (state, action) => {
      state.feedback = action.payload;
    },
    clearFeedback: (state, action) => {
      if (action.payload && action.payload === state.feedback)
        state.feedback = '';
      if (!action.payload) state.feedback = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncGetMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(asyncGetMessages.fulfilled, (state, action) => {
        // state.messages = action.payload;
      })
      .addCase(asyncGetMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      })
      .addCase(asyncCreateMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(asyncCreateMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.message = action.payload;
      })
      .addCase(asyncCreateMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      })
      .addCase(asyncUpdateMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(asyncUpdateMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.message = action.payload;
      })
      .addCase(asyncUpdateMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      })
      .addCase(asyncDeleteMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(asyncDeleteMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.message = action.payload;
      })
      .addCase(asyncDeleteMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      })
      .addCase(asyncSendFeedback.rejected, (state, action) => {
        state.errorMessage = action.payload;
      });
  },
});

export const {
  unsetIsLoading,
  socketGetMessages,
  socketGetMessage,
  socketUpdateMessage,
  socketDeleteMessage,
  socketGetFeedback,
  clearFeedback,
} = messagesSlice.actions;
export default messagesSlice.reducer;
