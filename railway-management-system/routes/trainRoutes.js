// routes/trainRoutes.js
const express = require('express');
const { addTrain, getAvailability } = require('../controllers/trainController');
const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();

router.post('/trains', authenticateToken, addTrain);
router.get('/trains', getAvailability);

module.exports = router;
