const express = require('express');
const router = express.Router();
const nameController = require('../../controllers/nameController');
// const ROLES_LIST = require('../../config/roles_list');
// const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(nameController.getAllNames)
    // .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), nameController.createNewName)
    // .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), nameController.updateName)
    // .delete(verifyRoles(ROLES_LIST.Admin), nameController.deleteName);
    .post(nameController.createNewName)
    .put(nameController.updateName)
    .delete(nameController.deleteName);

router.route('/:id')
    .get(nameController.getName);

module.exports = router;