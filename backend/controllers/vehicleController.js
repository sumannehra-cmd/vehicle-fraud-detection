const Vehicle = require('../models/Vehicle');

exports.addVehicle = async (req, res) => {
  const vehicle = await Vehicle.create({ ...req.body, owner: req.user._id });
  res.status(201).json(vehicle);
};

exports.getMyVehicles = async (req, res) => {
  const vehicles = await Vehicle.find({ owner: req.user._id });
  res.json(vehicles);
};

exports.getAllVehicles = async (req, res) => {
  const vehicles = await Vehicle.find().populate('owner', 'name email');
  res.json(vehicles);
};

exports.blacklistVehicle = async (req, res) => {
  const { reason } = req.body;
  const vehicle = await Vehicle.findByIdAndUpdate(
    req.params.id,
    { isBlacklisted: true, blacklistReason: reason },
    { new: true }
  );
  if (!vehicle) return res.status(404).json({ message: 'Gaadi nahi mili' });
  res.json(vehicle);
};