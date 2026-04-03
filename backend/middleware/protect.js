const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// Yeh middleware check karta hai — kya user logged in hai?
const protect = async (req, res, next) => {
  try {
    // Cookie se token lo
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: 'Login karo pehle' });
    }

    // Token verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // User database se dhundo
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User nahi mila' });
    }

    next();  // aage jaao
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expire ho gaya', code: 'TOKEN_EXPIRED' });
    }
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Sirf admin aur investigator ke liye
const adminOnly = (req, res, next) => {
  if (!['admin', 'investigator'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Admin access chahiye' });
  }
  next();
};

module.exports = { protect, adminOnly };