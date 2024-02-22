module.exports = (io) => {
  const express = require('express');
  const { protect } = require('../middleware/authMiddleware');
  const router = express.Router();
  const {
    getMessages,
    createMessage,
    getMessageById,
    updateMessage,
    deleteMessage,
  } = require('../controllers/messageController')(io);

  router.route('/').get(protect, getMessages).post(protect, createMessage);

  router
    .route('/:id')
    .get(protect, getMessageById)
    .put(protect, updateMessage)
    .delete(protect, deleteMessage);
  return router;
};
