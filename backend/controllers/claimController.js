const Claim        = require('../models/Claim');
const analyzeFraud = require('../utils/fraudEngine');

// CLAIM BANAO
exports.createClaim = async (req, res, next) => {
  try {
    const { fraudScore, fraudFlags, isFraudulent, riskLevel } =
      await analyzeFraud(req.body, req.user._id);

    const claim = await Claim.create({
      ...req.body,
      claimant:     req.user._id,
      fraudScore,
      fraudFlags,
      isFraudulent,
      riskLevel,
      status: isFraudulent ? 'under_review' : 'pending',
    });

    await claim.populate('vehicle claimant', 'registrationNo make model name email');
    res.status(201).json(claim);
  } catch (error) {
    next(error);
  }
};

// SAARE CLAIMS
exports.getClaims = async (req, res, next) => {
  try {
    const filter = ['admin', 'investigator'].includes(req.user.role)
      ? {}
      : { claimant: req.user._id };

    const { status, riskLevel, isFraudulent, page = 1, limit = 10 } = req.query;
    if (status)                    filter.status = status;
    if (riskLevel)                 filter.riskLevel = riskLevel;
    if (isFraudulent !== undefined)
      filter.isFraudulent = isFraudulent === 'true';

    const skip = (Number(page) - 1) * Number(limit);

    const [claims, total] = await Promise.all([
      Claim.find(filter)
        .populate('vehicle', 'registrationNo make model year')
        .populate('claimant', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Claim.countDocuments(filter),
    ]);

    res.json({
      claims,
      total,
      page:  Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    next(error);
  }
};

// EK CLAIM
exports.getClaimById = async (req, res, next) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate('vehicle claimant policy reviewedBy');

    if (!claim) return res.status(404).json({ message: 'Claim nahi mila' });

    if (
      req.user.role === 'user' &&
      claim.claimant._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Yeh tumhara claim nahi hai' });
    }

    res.json(claim);
  } catch (error) {
    next(error);
  }
};

// STATUS UPDATE
exports.updateStatus = async (req, res, next) => {
  try {
    const { status, reviewNotes } = req.body;

    const claim = await Claim.findByIdAndUpdate(
      req.params.id,
      {
        status,
        reviewNotes,
        reviewedBy: req.user._id,
        reviewedAt: new Date(),
      },
      { new: true }
    ).populate('claimant vehicle');

    if (!claim) return res.status(404).json({ message: 'Claim nahi mila' });
    res.json(claim);
  } catch (error) {
    next(error);
  }
};