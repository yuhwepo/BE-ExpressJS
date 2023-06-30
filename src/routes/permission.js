const express = require('express');
const permissionRouter = express.Router();

const permissionController = require("../controllers/permissionController");

permissionRouter.post('/', permissionController.createPermission);
permissionRouter.get('/', permissionController.getPermissions);
permissionRouter.get('/:id', permissionController.getPermissionById);
permissionRouter.put('/:id', permissionController.updatePermission);
permissionRouter.delete('/:id', permissionController.deletePermission);

module.exports = permissionRouter;