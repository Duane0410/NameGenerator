const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

router.route('/')
    .put(scheduleController.updateScheduleOptions)

router.route('/:id')
    .get(scheduleController.getScheduleOptions)

module.exports = router;