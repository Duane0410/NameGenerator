const express = require('express');
const router = express.Router();
const teamController = require('../../controllers/teamController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(teamController.getAllTeams)
    .post(teamController.createNewTeam)
    .put(teamController.updateTeam)
    .delete(teamController.deleteTeam);

router.route('/:id')
    .get(teamController.getTeam);

module.exports = router;