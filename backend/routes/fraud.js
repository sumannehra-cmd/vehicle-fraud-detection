const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/protect');
const Claim = require('../models/Claim');

// Dashboard ke liye stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  const [total, fraudulent, pending, critical] = await Promise.all([
    Claim.countDocuments(),
    Claim.countDocuments({ isFraudulent: true }),
    Claim.countDocuments({ status: 'pending' }),
    Claim.countDocuments({ riskLevel: 'critical' }),
  ]);

  // Har type ke fraud ke counts
  const fraudByType = await Claim.aggregate([
    { $match: { isFraudulent: true } },
    { $group: { _id: '$incidentType', count: { $sum: 1 } } },
  ]);

  // Last 6 months ka monthly data
  const monthlyFraud = await Claim.aggregate([
    { $match: { isFraudulent: true } },
    {
      $group: {
        _id: {
          month: { $month: '$createdAt' },
          year:  { $year:  '$createdAt' },
        },
        count:       { $sum: 1 },
        totalAmount: { $sum: '$claimAmount' },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ]);

  res.json({
    total, fraudulent, pending, critical,
    fraudByType, monthlyFraud,
    fraudRate: total > 0 ? ((fraudulent / total) * 100).toFixed(1) : 0,
  });
});

// Sirf fraud wale claims
router.get('/flagged', protect, adminOnly, async (req, res) => {
  const claims = await Claim.find({ isFraudulent: true })
    .populate('claimant', 'name email phone')
    .populate('vehicle',  'registrationNo make model')
    .sort({ fraudScore: -1 });
  res.json(claims);
});

module.exports = router;