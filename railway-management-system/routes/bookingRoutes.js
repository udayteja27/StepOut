// routes/bookingRoutes.js
const express = require('express');
const { bookSeat, getBookingDetails } = require('../controllers/bookingController');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

router.post('/bookings/:train_id', authenticateToken, bookSeat);
router.get('/bookings/:booking_id', authenticateToken, getBookingDetails);

module.exports = router;
