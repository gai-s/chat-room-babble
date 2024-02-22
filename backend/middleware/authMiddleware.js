const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');
      // NOTE: We need to check if a user was found
      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized');
      }
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized');
    }
  }
  if (!token) {
    res.status(401);
    throw new Error('Not authorized');
  }
});

const socketProtect = asyncHandler(async (socket, next) => {
  let token;
  if (socket.handshake.query.myToken) {
    try {
      // Get token from header
      token = socket.handshake.query.myToken;
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      // NOTE: We need to check if a user was found
      if (!user) {
        next(new Error('Not authorized'));
      }
      socket.user = user;
      next();
    } catch (error) {
      console.log(error.message);
      next(new Error(`Not authorized ${error.message}`));
    }
  }
  if (!token) {
    next(new Error('Not authorized'));
  }
});

module.exports = { protect, socketProtect };
