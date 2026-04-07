const Claim = require('../models/Claim');
const Vehicle = require('../models/Vehicle');

const analyzeFraud = async (claimData) => {
    let score = 0;
    const flags = [];

    // Rule 1: Same vehicle claimed more than 3 times in 6 months
    const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
    const recentClaims = await Claim.countDocuments({
        vehicle: claimData.vehicle,
        claimDate: { $gte: sixMonthsAgo }
    });
    if (recentClaims >= 3) {
        score += 40;
        flags.push('Multiple claims on same vehicle within 6 months');
    }

    // Rule 2: Claim amount unusually high (> 5 lakh)
    if (claimData.amount > 500000) {
        score += 20;
        flags.push('Unusually high claim amount');
    }

    // Rule 3: Incident date before policy start or on same day as policy
    if (claimData.policy) {
        const Policy = require('../models/Policy');
        const policy = await Policy.findById(claimData.policy);
        if (policy) {
            const daysDiff = (new Date(claimData.incidentDate) - new Date(policy.startDate)) / (1000 * 60 * 60 * 24);
            if (daysDiff < 7) {
                score += 30;
                flags.push('Incident occurred within 7 days of policy start');
            }
        }
    }

    // Rule 4: Vehicle is blacklisted
    const vehicle = await Vehicle.findById(claimData.vehicle);
    if (vehicle && vehicle.isBlacklisted) {
        score += 50;
        flags.push(`Blacklisted vehicle: ${vehicle.blacklistReason}`);
    }

    // Rule 5: Same user filed 2+ claims in 3 months
    const threeMonthsAgo = new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000);
    const userClaims = await Claim.countDocuments({
        user: claimData.user,
        claimDate: { $gte: threeMonthsAgo }
    });
    if (userClaims >= 2) {
        score += 25;
        flags.push('Frequent claimant — 2+ claims in 3 months');
    }

    return {
        fraudScore: Math.min(score, 100),
        fraudFlags: flags,
        isFraudulent: score >= 50
    };
};

module.exports = analyzeFraud;