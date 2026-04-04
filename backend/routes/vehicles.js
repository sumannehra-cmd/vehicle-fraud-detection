const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/protect');
const {
  addVehicle, getMyVehicles, getAllVehicles, blacklistVehicle
} = require('../controllers/vehicleController');

router.post('/',     protect, addVehicle);
router.get('/mine',  protect, getMyVehicles);
router.get('/',      protect, adminOnly, getAllVehicles);
router.put('/:id/blacklist', protect, adminOnly, blacklistVehicle);

module.exports = router;