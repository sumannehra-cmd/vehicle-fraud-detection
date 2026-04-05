const express = require("express");
const router = express.Router();
const { Vehicle, Policy, Claim } = require("./models");

// -------- FRAUD DETECTION LOGIC --------
function detectFraud(amount, policyAgeDays, claimsInLastMonth) {
    const reasons = [];
    if (amount > 500000) reasons.push("Unusually high claim amount");
    if (claimsInLastMonth > 2) reasons.push("Multiple claims in short period");
    if (policyAgeDays < 30) reasons.push("Claim filed too soon after policy start");
    return { fraud: reasons.length > 0, reasons };
}

// -------- VEHICLE ROUTES --------
router.get("/vehicles", async (req, res) => {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
});

router.post("/vehicles", async (req, res) => {
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res.json({ message: "Vehicle added", vehicle });
});

// -------- POLICY ROUTES --------
router.get("/policies", async (req, res) => {
    const policies = await Policy.find();
    res.json(policies);
});

router.post("/policies", async (req, res) => {
    const policy = new Policy(req.body);
    await policy.save();
    res.json({ message: "Policy created", policy });
});

// -------- CLAIM ROUTES --------
router.get("/claims", async (req, res) => {
    const claims = await Claim.find();
    res.json(claims);
});

router.post("/claims", async (req, res) => {
    const { amount, policy_age_days, claims_in_last_month } = req.body;
    const { fraud, reasons } = detectFraud(amount, policy_age_days, claims_in_last_month);
    const claim = new Claim({ ...req.body, fraud_flag: fraud, fraud_reasons: reasons });
    await claim.save();
    res.json({ message: "Claim filed", fraud_flag: fraud, fraud_reasons: reasons, claim });
});

router.get("/claims/:claim_id/fraud-check", async (req, res) => {
    const claim = await Claim.findOne({ claim_id: req.params.claim_id });
    if (!claim) return res.status(404).json({ message: "Claim not found" });
    res.json({ claim_id: claim.claim_id, fraud_flag: claim.fraud_flag, fraud_reasons: claim.fraud_reasons });
});

module.exports = router;