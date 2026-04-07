const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    policy: { type: mongoose.Schema.Types.ObjectId, ref: 'Policy' },
    claimDate: { type: Date, default: Date.now },
    incidentDate: { type: Date, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'under_review'], default: 'pending' },
    fraudScore: { type: Number, default: 0 },
    fraudFlags: [String],
    isFraudulent: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Claim', claimSchema);