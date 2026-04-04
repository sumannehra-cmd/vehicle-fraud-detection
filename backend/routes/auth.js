const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/protect');
const {
  register, login, logout, getMe, refresh
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login',    login);
router.post('/logout',   logout);
router.post('/refresh',  refresh);
router.get('/me', protect, getMe);

module.exports = router;