const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/protect');
const {
    createClaim, getClaims, getClaimById, updateStatus
} = require('../controllers/claimController');

router.route('/')
    .post(protect, createClaim)
    .get(protect, getClaims);

router.route('/:id')
    .get(protect, getClaimById);

router.put('/:id/status', protect, adminOnly, updateStatus);

module.exports = router;