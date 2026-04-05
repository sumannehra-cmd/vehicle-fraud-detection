const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    vehicle_id: String,
    owner_name: String,
    registration_no: String,
    make: String,
    model: String,
    year: Number,
    vin: String,
});

const policySchema = new mongoose.Schema({
    policy_id: String,
    vehicle_id: String,
    holder_name: String,
    start_date: String,
    end_date: String,
    premium: Number,
    coverage_type: String,
});

const claimSchema = new mongoose.Schema({
    claim_id: String,
    policy_id: String,
    vehicle_id: String,
    claim_date: String,
    damage_description: String,
    amount: Number,
    status: { type: String, default: "pending" },
    fraud_flag: { type: Boolean, default: false },
    fraud_reasons: [String],
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);
const Policy = mongoose.model("Policy", policySchema);
const Claim = mongoose.model("Claim", claimSchema);

module.exports = { Vehicle, Policy, Claim };