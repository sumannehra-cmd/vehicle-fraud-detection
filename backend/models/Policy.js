const mongoose = require('mongoose');

const policySchema = new mongoose.Schema(
    {
        policyNumber: {
            type: String,
            required: true,
            unique: true,
        },
        holder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        vehicle: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vehicle',
            required: true,
        },
        policyType: {
            type: String,
            enum: ['third-party', 'comprehensive'],
            required: true,
        },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        premiumAmount: { type: Number, required: true },
        coverageAmount: { type: Number, required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Policy', policySchema);