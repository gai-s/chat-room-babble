const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const axios = require('axios');

// @desc: Register a new user
// @route Post /api/users
// @access Public

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please include all fields');
  }
  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    gravatarUrl: (await hasGravatarCheck(email)) ? getGravatar(email) : null,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc: Login a new user
// @route Post /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!password || !email) {
    res.status(400);
    throw new Error('Please include all fields');
  }
  const user = await User.findOne({ email });

  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid password');
    }
  } else {
    res.status(400);
    throw new Error('User not found');
  }
});

// @desc: Get users
// @route Get /api/users/
// @access Public
const getUsers = asyncHandler(async (req, res) => {
  let users = await User.find();
  users = users.map((user) => {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  });

  return res.status(200).json(users);
});

const getMe = asyncHandler(async (req, res) => {
  const user = {
    // id: req.user._id,
    // name: req.user.name,
    // email: req.user.email,
    // createdAt: req.user.createdAt,
  };
  res.status(200).json(user);
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const getGravatar = (email) => {
  const hash = md5(email);
  return `https://www.gravatar.com/avatar/${hash}?d=404&s=200`;
};

const hasGravatarCheck = async (email) => {
  try {
    const response = await axios.get(getGravatar(email), {
      responseType: 'text',
    });
    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

module.exports = { registerUser, loginUser, getMe };
