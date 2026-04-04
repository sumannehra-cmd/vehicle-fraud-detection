const Claim = require('../models/Claim');

// Fraud stats — dashboard ke liye
exports.getFraudStats = async (req, res, next) => {
  try {
    const [total, fraudulent, pending, critical] = await Promise.all([
      Claim.countDocuments(),
      Claim.countDocuments({ isFraudulent: true }),
      Claim.countDocuments({ status: 'pending' }),
      Claim.countDocuments({ riskLevel: 'critical' }),
    ]);

    const fraudByType = await Claim.aggregate([
      { $match: { isFraudulent: true } },
      { $group: { _id: '$incidentType', count: { $sum: 1 } } },
    ]);

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
      total,
      fraudulent,
      pending,
      critical,
      fraudByType,
      monthlyFraud,
      fraudRate: total > 0
        ? ((fraudulent / total) * 100).toFixed(1)
        : 0,
    });
  } catch (error) {
    next(error);
  }
};

// Sirf fraud wale claims
exports.getFlaggedClaims = async (req, res, next) => {
  try {
    const claims = await Claim.find({ isFraudulent: true })
      .populate('claimant', 'name email phone')
      .populate('vehicle',  'registrationNo make model')
      .sort({ fraudScore: -1 });
    res.json(claims);
  } catch (error) {
    next(error);
  }
};