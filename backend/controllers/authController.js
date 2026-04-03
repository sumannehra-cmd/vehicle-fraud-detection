const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// REGISTER — naya user banana
exports.register = async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  // Check karo — kya yeh email pehle se hai?
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'Yeh email pehle se registered hai' });
  }

  // Naya user banao
  const user = await User.create({ name, email, password, role, phone });

  // Cookie set karo
  generateToken(res, user._id, user.role);

  res.status(201).json({
    _id:   user._id,
    name:  user.name,
    email: user.email,
    role:  user.role,
  });
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // User dhundo — password bhi lo (select: false tha schema mein)
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Email ya password galat hai' });
  }

  if (!user.isActive) {
    return res.status(403).json({ message: 'Account band kar diya gaya hai' });
  }

  // Cookie set karo
  generateToken(res, user._id, user.role);

  res.json({
    _id:   user._id,
    name:  user.name,
    email: user.email,
    role:  user.role,
  });
};

// LOGOUT
exports.logout = (req, res) => {
  // Cookie clear karo
  res.cookie('accessToken',  '', { httpOnly: true, expires: new Date(0) });
  res.cookie('refreshToken', '', { httpOnly: true, expires: new Date(0) });
  res.json({ message: 'Logout successful' });
};

// GET ME — mera profile
exports.getMe = (req, res) => {
  res.json(req.user);
};