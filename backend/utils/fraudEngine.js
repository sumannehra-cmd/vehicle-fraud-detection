const Claim   = require('../models/Claim');
const Vehicle = require('../models/Vehicle');
const Policy  = require('../models/Policy');

const analyzeFraud = async (claimData, userId) => {
  let score = 0;
  const flags = [];

  // ━━ RULE 1: Gaadi blacklisted hai? ━━
  if (claimData.vehicle) {
    const vehicle = await Vehicle.findById(claimData.vehicle);
    if (vehicle && vehicle.isBlacklisted) {
      score += 50;
      flags.push(`Gaadi blacklist mein hai: ${vehicle.blacklistReason}`);
    }
  }

  // ━━ RULE 2: Ek hi gaadi pe 6 mahine mein 2+ claims ━━
  const sixMonths = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
  const sameVehicleClaims = await Claim.countDocuments({
    vehicle:   claimData.vehicle,
    createdAt: { $gte: sixMonths },
  });
  if (sameVehicleClaims >= 2) {
    score += 35;
    flags.push(`Is gaadi pe 6 mahine mein ${sameVehicleClaims} claims aaye hain`);
  }

  // ━━ RULE 3: Ek hi banda 3 mahine mein 2+ claims ━━
  const threeMonths = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const sameUserClaims = await Claim.countDocuments({
    claimant:  userId,
    createdAt: { $gte: threeMonths },
  });
  if (sameUserClaims >= 2) {
    score += 25;
    flags.push(`Is user ne 3 mahine mein ${sameUserClaims} claims kiye hain`);
  }

  // ━━ RULE 4: Policy lene ke 30 din ke andar claim ━━
  if (claimData.policy) {
    const policy = await Policy.findById(claimData.policy);
    if (policy) {
      const daysDiff = Math.floor(
        (new Date(claimData.incidentDate) - new Date(policy.startDate)) /
        (1000 * 60 * 60 * 24)
      );
      if (daysDiff < 30) {
        score += 30;
        flags.push(`Policy shuru hone ke sirf ${daysDiff} din baad incident hua`);
      }
      // Policy expire ho gayi thi?
      if (new Date() > new Date(policy.endDate)) {
        score += 20;
        flags.push('Claim ke waqt policy expire ho chuki thi');
      }
    }
  }

  // ━━ RULE 5: Bahut zyada claim amount ━━
  if (claimData.claimAmount > 500000) {
    score += 20;
    flags.push(`Bahut zyada claim amount: Rs. ${claimData.claimAmount.toLocaleString('en-IN')}`);
  }

  // ━━ RULE 6: Incident 90 din purana ━━
  const incidentAge = Math.floor(
    (Date.now() - new Date(claimData.incidentDate)) / (1000 * 60 * 60 * 24)
  );
  if (incidentAge > 90) {
    score += 15;
    flags.push(`Incident ${incidentAge} din pehle hua — bahut der se report kiya`);
  }

  // ━━ RULE 7: Incident date future mein hai ━━
  if (incidentAge < 0) {
    score += 40;
    flags.push('Incident date future mein hai — yeh possible nahi');
  }

  // ━━ RULE 8: Same vehicle, same date pe duplicate claim ━━
  const duplicate = await Claim.findOne({
    vehicle:      claimData.vehicle,
    incidentDate: claimData.incidentDate,
  });
  if (duplicate) {
    score += 60;
    flags.push('Duplicate claim: Is gaadi pe is date ka claim pehle se exist karta hai');
  }

  // 100 se zyada nahi jaane denge
  score = Math.min(score, 100);

  // Risk level decide karo
  let riskLevel = 'low';
  if (score >= 75)      riskLevel = 'critical';
  else if (score >= 50) riskLevel = 'high';
  else if (score >= 25) riskLevel = 'medium';

  return {
    fraudScore: score,
    fraudFlags: flags,
    isFraudulent: score >= 50,
    riskLevel,
  };
};

module.exports = analyzeFraud;