const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Not authorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
};

const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin')
        return res.status(403).json({ message: 'Admin access only' });
    next();
};

module.exports = { protect, adminOnly };