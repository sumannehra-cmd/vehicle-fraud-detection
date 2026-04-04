const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    owner: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    registrationNo: {
      type:      String,
      required:  [true, 'Registration number zaroori hai'],
      unique:    true,
      uppercase: true,
    },
    make:     { type: String, required: true },
    model:    { type: String, required: true },
    year:     { type: Number, required: true },
    color:    { type: String },
    fuelType: {
      type: String,
      enum: ['petrol', 'diesel', 'electric', 'cng'],
    },
    isBlacklisted:   { type: Boolean, default: false },
    blacklistReason: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);