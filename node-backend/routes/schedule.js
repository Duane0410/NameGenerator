const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

router.put('/', scheduleController.handleSchedule);

module.exports = router;