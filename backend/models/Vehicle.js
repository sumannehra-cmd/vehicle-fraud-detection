const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    registrationNo: { type: String, required: true, unique: true },
    make: String,
    model: String,
    year: Number,
    isBlacklisted: { type: Boolean, default: false },
    blacklistReason: String
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);