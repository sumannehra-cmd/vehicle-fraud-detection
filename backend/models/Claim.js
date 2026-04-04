const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema(
  {
    claimNumber: { type: String, unique: true },

    claimant: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    vehicle: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Vehicle',
      required: true,
    },
    policy: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Policy',
      required: true,
    },
    incidentType: {
      type:     String,
      enum:     ['collision', 'theft', 'fire', 'flood', 'vandalism', 'other'],
      required: true,
    },
    incidentDate:     { type: Date,   required: true },
    incidentLocation: { type: String, required: true },
    description:      { type: String, required: true, minlength: 20 },
    claimAmount:      { type: Number, required: true },

    status: {
      type:    String,
      enum:    ['pending', 'under_review', 'approved', 'rejected', 'escalated'],
      default: 'pending',
    },

    // Fraud fields — fraudEngine fill karega
    fraudScore:   { type: Number,  default: 0, min: 0, max: 100 },
    fraudFlags:   [String],
    isFraudulent: { type: Boolean, default: false },
    riskLevel: {
      type:    String,
      enum:    ['low', 'medium', 'high', 'critical'],
      default: 'low',
    },

    reviewedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewNotes: { type: String },
    reviewedAt:  { type: Date },
  },
  { timestamps: true }
);

// Auto claim number generate karo
claimSchema.pre('save', async function (next) {
  if (!this.claimNumber) {
    const count      = await mongoose.model('Claim').countDocuments();
    this.claimNumber = `CLM-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Claim', claimSchema);