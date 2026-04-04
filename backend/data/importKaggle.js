const fs       = require('fs');
const csv      = require('csvtojson');
const mongoose = require('mongoose');
const dotenv   = require('dotenv');
dotenv.config();

const Claim = require('../models/Claim');
const User  = require('../models/User');

const importData = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const admin = await User.findOne({ role: 'admin' });

  const rows = await csv().fromFile('./data/insurance_claims.csv');
  console.log(`Found ${rows.length} rows`);

  for (const row of rows.slice(0, 500)) {
    try {
      await Claim.create({
        claimant:         admin._id,
        vehicle:          admin._id,  // placeholder
        policy:           admin._id,  // placeholder
        incidentType:     row.incident_type?.toLowerCase().includes('theft') ? 'theft' : 'collision',
        incidentDate:     new Date(row.incident_date || Date.now()),
        incidentLocation: row.incident_city || 'Unknown',
        description:      row.incident_type || 'Imported from dataset',
        claimAmount:      parseFloat(row.total_claim_amount) || 10000,
        isFraudulent:     row.fraud_reported === 'Y',
        fraudScore:       row.fraud_reported === 'Y' ? 75 : 10,
        riskLevel:        row.fraud_reported === 'Y' ? 'high' : 'low',
        status:           'pending',
      });
    } catch (e) {
      // skip duplicates
    }
  }

  console.log('✅ Kaggle data imported!');
  process.exit(0);
};

// csvtojson install: npm install csvtojson
importData();