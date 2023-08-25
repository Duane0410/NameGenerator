const express = require('express');
const router = express.Router();
const resourceController = require('../../controllers/resourceController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(resourceController.getAllResources)
    .post(resourceController.createNewResource)
    // .put(verifyRoles(ROLES_LIST.Leader, ROLES_LIST.Member), resourceController.updateResource)
    // .delete(verifyRoles(ROLES_LIST.Leader), resourceController.deleteResource);
    .put(resourceController.updateResource);

router.route('/:id')
    .delete(resourceController.deleteResource)
    .get(resourceController.getResource);

module.exports = router;