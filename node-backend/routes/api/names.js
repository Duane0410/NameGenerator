const express = require('express');
const router = express.Router();
const nameController = require('../../controllers/nameController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(nameController.getAllname)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), nameController.createNewEmployee)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), nameController.updateEmployee)
    .delete(verifyRoles(ROLES_LIST.Admin), nameController.deleteEmployee);

router.route('/:id')
    .get(nameController.getEmployee);

module.exports = router;