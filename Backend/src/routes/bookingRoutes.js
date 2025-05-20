const express = require('express');
const router = express.Router();
const {
  getVehicleTypes,
  getVehiclesByType,
  submitBooking
} = require('../controllers/bookingController');

router.get('/vehicle-types', getVehicleTypes);
router.get('/vehicles/:typeId', getVehiclesByType);
router.post('/book', submitBooking);

module.exports = router;
