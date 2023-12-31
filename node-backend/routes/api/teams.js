const express = require('express');
const router = express.Router();
const teamController = require('../../controllers/teamController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    // .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Leader, ROLES_LIST.Member), teamController.getAllTeams)
    // .post(teamController.createNewTeam)
    // .put(verifyRoles(ROLES_LIST.Leader, ROLES_LIST.Member), teamController.updateTeam)
    // .delete(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Leader), teamController.deleteTeam);
    .get(teamController.getAllTeams)
    .post(teamController.createNewTeam)
    .put(teamController.updateTeam)
    // .delete(teamController.deleteTeam);

router.route('/:id')
    // .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Leader, ROLES_LIST.Member), teamController.getTeam);
    .delete(teamController.deleteTeam)
    .get(teamController.getTeam);

module.exports = router;