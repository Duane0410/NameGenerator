const express = require('express');
const router = express.Router();
const resourceTypeController = require('../../controllers/resourceTypeController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(resourceTypeController.getAllResourceTypes)
    .post(resourceTypeController.createNewResourceType)
    // .put(verifyRoles(ROLES_LIST.Leader, ROLES_LIST.Member), resourceTypeController.updateResourceType)
    // .delete(verifyRoles(ROLES_LIST.Leader), resourceTypeController.deleteResourceType);
    .put(resourceTypeController.updateResourceType);

router.route('/:id')
    .delete(resourceTypeController.deleteResourceType)
    .get(resourceTypeController.getResourceType);

module.exports = router;