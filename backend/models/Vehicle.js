const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  registrationNo: {
    type: String,
    required: [true, 'Registration number zaroori hai'],
    unique: true,
    uppercase: true,  // automatically capital letters mein save hoga
  },
  make:  { type: String, required: true },    // brand — Maruti, Honda
  model: { type: String, required: true },    // model — Swift, City
  year:  { type: Number, required: true },    // manufacturing year
  color: { type: String },
  fuelType: {
    type: String,
    enum: ['petrol', 'diesel', 'electric', 'cng'],
  },
  // Fraud se related fields
  isBlacklisted:   { type: Boolean, default: false },
  blacklistReason: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);