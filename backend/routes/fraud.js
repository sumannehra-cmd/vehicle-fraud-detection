const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/protect');
const { getFraudStats, getFlaggedClaims } = require('../controllers/fraudController');

router.get('/stats',   protect, adminOnly, getFraudStats);
router.get('/flagged', protect, adminOnly, getFlaggedClaims);

module.exports = router;