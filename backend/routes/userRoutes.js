const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUser,
  deleteUser,
} = require('../controllers/userController');

router.post('/', registerUser);

router.post('/login', loginUser);

router.get('/profile', protect, getUser);

router.delete('/:id', protect, deleteUser);

module.exports = router;
