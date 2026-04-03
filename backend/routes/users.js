const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/protect');
const User = require('../models/User');

// Saare users (admin only)
router.get('/', protect, adminOnly, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// Ek user ka profile
router.get('/:id', protect, async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User nahi mila' });
  res.json(user);
});

// User status change (admin)
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: req.body.isActive },
    { new: true }
  ).select('-password');
  res.json(user);
});

module.exports = router;