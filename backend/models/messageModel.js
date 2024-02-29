const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    userName: {
      type: String,
    },
    email: {
      type: String,
    },
    gravatarUrl: {
      type: String || null,
    },
    content: {
      type: String,
      required: [true, 'Please add message content'],
    },
    edited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Message', messageSchema);
