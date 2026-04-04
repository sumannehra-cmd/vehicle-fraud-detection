const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/protect');
const User = require('../models/User');

// Saare users
router.get('/', protect, adminOnly, async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// User active/inactive karo
router.put('/:id/status', protect, adminOnly, async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: req.body.isActive },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User nahi mila' });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;