const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/protect');
const Policy = require('../models/Policy');

// Policy banao
router.post('/', protect, async (req, res, next) => {
    try {
        const policy = await Policy.create({ ...req.body, holder: req.user._id });
        res.status(201).json(policy);
    } catch (error) {
        next(error);
    }
});

// Apni policies
router.get('/mine', protect, async (req, res, next) => {
    try {
        const policies = await Policy.find({ holder: req.user._id })
            .populate('vehicle', 'registrationNo make model');
        res.json(policies);
    } catch (error) {
        next(error);
    }
});

// Saari policies — admin
router.get('/', protect, adminOnly, async (req, res, next) => {
    try {
        const policies = await Policy.find()
            .populate('holder', 'name email')
            .populate('vehicle', 'registrationNo make model');
        res.json(policies);
    } catch (error) {
        next(error);
    }
});

module.exports = router;