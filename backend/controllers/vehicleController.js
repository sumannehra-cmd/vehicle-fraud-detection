const Vehicle = require('../models/Vehicle');

exports.addVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.create({ ...req.body, owner: req.user._id });
    res.status(201).json(vehicle);
  } catch (error) {
    next(error);
  }
};

exports.getMyVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user._id });
    res.json(vehicles);
  } catch (error) {
    next(error);
  }
};

exports.getAllVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find().populate('owner', 'name email');
    res.json(vehicles);
  } catch (error) {
    next(error);
  }
};

exports.blacklistVehicle = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      {
        isBlacklisted:   true,
        blacklistReason: reason,
      },
      { new: true }
    );
    if (!vehicle) return res.status(404).json({ message: 'Gaadi nahi mili' });
    res.json(vehicle);
  } catch (error) {
    next(error);
  }
};