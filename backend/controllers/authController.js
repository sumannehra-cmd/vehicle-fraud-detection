const User          = require('../models/User');
const generateToken = require('../utils/generateToken');
const jwt           = require('jsonwebtoken');

// REGISTER
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email pehle se registered hai' });
    }

    const user = await User.create({ name, email, password, role, phone });
    generateToken(res, user._id, user.role);

    res.status(201).json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
    });
  } catch (error) {
    next(error);
  }
};

// LOGIN
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Email ya password galat hai' });
    }
    if (!user.isActive) {
      return res.status(403).json({ message: 'Account band kar diya gaya hai' });
    }

    generateToken(res, user._id, user.role);

    res.json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
    });
  } catch (error) {
    next(error);
  }
};

// LOGOUT
exports.logout = (req, res) => {
  res.cookie('accessToken',  '', { httpOnly: true, expires: new Date(0) });
  res.cookie('refreshToken', '', { httpOnly: true, expires: new Date(0) });
  res.json({ message: 'Logout successful' });
};

// GET ME
exports.getMe = (req, res) => {
  res.json(req.user);
};

// REFRESH TOKEN
exports.refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ message: 'Refresh token nahi mila' });
    }
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user    = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User nahi mila' });
    }
    generateToken(res, user._id, user.role);
    res.json({ message: 'Token refresh ho gaya' });
  } catch (error) {
    next(error);
  }
};