const Claim        = require('../models/Claim');
const analyzeFraud = require('../utils/fraudEngine');

// CLAIM BANAO
exports.createClaim = async (req, res) => {
  const claimData = req.body;

  // Fraud engine chalao — score aur flags milenge
  const { fraudScore, fraudFlags, isFraudulent, riskLevel } =
    await analyzeFraud(claimData, req.user._id);

  const claim = await Claim.create({
    ...claimData,
    claimant:     req.user._id,
    fraudScore,
    fraudFlags,
    isFraudulent,
    riskLevel,
    // Fraud detected toh auto review mein daalo
    status: isFraudulent ? 'under_review' : 'pending',
  });

  // Vehicle aur user ka data bhi bhejo
  await claim.populate('vehicle claimant', 'registrationNo make model name email');
  res.status(201).json(claim);
};

// SAARE CLAIMS DEKHO
exports.getClaims = async (req, res) => {
  // Admin: sab dekhe | User: sirf apna
  const filter = ['admin', 'investigator'].includes(req.user.role)
    ? {}
    : { claimant: req.user._id };

  // Query filters
  const { status, riskLevel, isFraudulent, page = 1, limit = 10 } = req.query;
  if (status)       filter.status = status;
  if (riskLevel)    filter.riskLevel = riskLevel;
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
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  });
};

// EK CLAIM DEKHO
exports.getClaimById = async (req, res) => {
  const claim = await Claim.findById(req.params.id)
    .populate('vehicle claimant policy reviewedBy');

  if (!claim) return res.status(404).json({ message: 'Claim nahi mila' });

  // Normal user sirf apna dekhe
  if (req.user.role === 'user' &&
      claim.claimant._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Yeh tumhara claim nahi hai' });
  }

  res.json(claim);
};

// STATUS UPDATE KARO (Admin only)
exports.updateStatus = async (req, res) => {
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
};