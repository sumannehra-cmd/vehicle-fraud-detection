require('dotenv').config();
const mongoose = require('mongoose');
const User    = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Policy  = require('../models/Policy');
const Claim   = require('../models/Claim');

const connectDB = require('../config/db');

const randomDate = (start, end) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const cities = ['Jaipur', 'Delhi', 'Mumbai', 'Pune', 'Ahmedabad', 'Surat', 'Lucknow'];
const carMakes = ['Maruti', 'Hyundai', 'Honda', 'Toyota', 'Tata', 'Mahindra'];
const carModels = {
  Maruti:   'Swift', Hyundai: 'i20', Honda: 'City',
  Toyota:   'Innova', Tata: 'Nexon', Mahindra: 'Scorpio'
};
const incidentTypes = ['collision', 'theft', 'fire', 'flood', 'vandalism', 'other'];

const run = async () => {
  await connectDB();

  // Purana data delete karo
  await User.deleteMany({});
  await Vehicle.deleteMany({});
  await Policy.deleteMany({});
  await Claim.deleteMany({});
  console.log('Purana data delete kar diya');

  // Admin banao
  const admin = await User.create({
    name: 'Admin User', email: 'admin@fraud.com',
    password: 'Admin@123', role: 'admin',
  });
  const investigator = await User.create({
    name: 'Investigator', email: 'investigator@fraud.com',
    password: 'Inv@123', role: 'investigator',
  });
  console.log('Admin aur Investigator ban gaye');

  // 20 regular users
  const users = [];
  for (let i = 1; i <= 20; i++) {
    const u = await User.create({
      name: `Test User ${i}`, email: `user${i}@test.com`,
      password: 'User@123', role: 'user',
    });
    users.push(u);
  }
  console.log('20 users ban gaye');

  // 30 vehicles — 3 blacklisted
  const vehicles = [];
  for (let i = 0; i < 30; i++) {
    const make = carMakes[i % carMakes.length];
    const v = await Vehicle.create({
      owner: users[i % 20]._id,
      registrationNo: `RJ14AB${String(1000 + i).padStart(4, '0')}`,
      make, model: carModels[make],
      year: 2015 + (i % 8),
      color: ['White', 'Black', 'Silver', 'Red', 'Blue'][i % 5],
      fuelType: ['petrol', 'diesel', 'cng'][i % 3],
      isBlacklisted: i < 3,
      blacklistReason: i < 3 ? 'Previous fraud claim detected' : undefined,
    });
    vehicles.push(v);
  }
  console.log('30 vehicles ban gaye (3 blacklisted)');

  // 30 policies
  const policies = [];
  for (let i = 0; i < 30; i++) {
    const start = randomDate(new Date('2023-01-01'), new Date('2024-06-01'));
    const end   = new Date(start);
    end.setFullYear(end.getFullYear() + 1);
    const p = await Policy.create({
      policyNumber:   `POL-2024-${String(i + 1).padStart(4, '0')}`,
      holder:         vehicles[i].owner,
      vehicle:        vehicles[i]._id,
      policyType:     i % 2 === 0 ? 'comprehensive' : 'third-party',
      startDate:      start,
      endDate:        end,
      premiumAmount:  5000 + i * 250,
      coverageAmount: 200000 + i * 10000,
    });
    policies.push(p);
  }
  console.log('30 policies ban gayi');

  // 200 claims — pehle 40 fraudulent hain
  let claimCount = 0;
  for (let i = 0; i < 200; i++) {
    const isFraud = i < 40;
    const vIdx    = isFraud ? (i % 3) : ((i % 27) + 3);

    await Claim.create({
      claimant:         vehicles[vIdx].owner,
      vehicle:          vehicles[vIdx]._id,
      policy:           policies[vIdx]._id,
      incidentType:     incidentTypes[i % incidentTypes.length],
      incidentDate:     randomDate(new Date('2024-01-01'), new Date()),
      incidentLocation: `${cities[i % cities.length]}, India`,
      description:      `Vehicle was damaged in a ${incidentTypes[i % incidentTypes.length]} incident near ${cities[i % cities.length]}. Immediate claim assistance required for repair.`,
      claimAmount:      isFraud ? 350000 + i * 3000 : 30000 + i * 800,
      fraudScore:       isFraud ? 60 + (i % 40) : Math.floor(Math.random() * 25),
      fraudFlags:       isFraud
        ? ['Blacklisted vehicle', 'High claim amount', 'Frequent claimant']
        : [],
      isFraudulent: isFraud,
      riskLevel:    isFraud ? (i < 10 ? 'critical' : 'high') : 'low',
      status:       isFraud ? 'under_review' : (i % 3 === 0 ? 'approved' : 'pending'),
    });
    claimCount++;
  }

  console.log(`\n✅ SEED COMPLETE!`);
  console.log(`Admin:         admin@fraud.com / Admin@123`);
  console.log(`Investigator:  investigator@fraud.com / Inv@123`);
  console.log(`Regular user:  user1@test.com / User@123`);
  console.log(`${claimCount} claims (40 fraud, 160 genuine)`);
  process.exit(0);
};

run().catch(err => { console.error(err); process.exit(1); });