const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

router.route('/')
    .get(scheduleController.getScheduleOptions)
    .put(scheduleController.updateScheduleOptions)

module.exports = router;