const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, role });
    generateToken(res, user._id);
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
        return res.status(401).json({ message: 'Invalid credentials' });

    generateToken(res, user._id);
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
};

exports.logout = (req, res) => {
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
    res.json({ message: 'Logged out' });
};

exports.getMe = (req, res) => res.json(req.user);