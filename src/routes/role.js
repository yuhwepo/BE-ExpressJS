const express = require("express");
const roleRouter = express.Router();

const roleController = require("../controllers/roleController");

roleRouter.post("/", roleController.createRole);
roleRouter.post("/:id/permission/:permissionId", roleController.assignPermissionToRole);
roleRouter.get("/", roleController.getRoles);
roleRouter.get("/:id", roleController.getRoleById);
roleRouter.put("/:id", roleController.updateRole);
roleRouter.delete("/:id", roleController.deleteRole);

module.exports = roleRouter;
