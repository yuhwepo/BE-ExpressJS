const Role = require("../models/roleModel");
const Permission = require("../models/permissionModel");

const createRole = async (req, res) => {
	try {
		const { name } = req.body;

		const role = await Role.create(name);

		return res.status(201).json({ success: true, role });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ success: false, err });
	}
};

const getRoles = async (req, res) => {
	try {
		const roles = await Role.findAll();

		return res.status(200).json({ success: true, roles });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ success: false, err });
	}
};

const getRoleById = async (req, res) => {
	try {
		const { id } = req.params;

		const role = await Role.findById(id);

		if (!role) {
			return res
				.status(404)
				.json({ success: false, error: "Role not found" });
		}

		return res.status(200).json({ success: true, role });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ success: false, err });
	}
};

const updateRole = async (req, res) => {
	try {
		const { id } = req.params;
		const { name } = req.body;

		const role = await Role.updateById(id, name);

		if (!role) {
			return res
				.status(404)
				.json({ success: false, error: "Role not found" });
		}

		return res.status(200).json({ success: true, role });
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ success: false, error: "Internal Server Error" });
	}
};

const deleteRole = async (req, res) => {
	try {
		const { id } = req.params;

		const role = await Role.deleteById(id);

		if (!role) {
			return res
				.status(404)
				.json({ success: false, error: "Role not found" });
		}

		return res.status(200).json({ success: true, role });
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.json({ success: false, error: "Internal Server Error" });
	}
};

const assignPermissionToRole = async (req, res) => {
	const roleId = parseInt(req.params.id, 10);
    const permissionId = parseInt(req.params.permissionId, 10);

	try {
		await Role.assignPermission(roleId, permissionId);

		return res
			.status(200)
			.json({ message: "Permission assigned to role successfully" });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

module.exports = {
	createRole,
	getRoles,
	getRoleById,
	updateRole,
	deleteRole,
    assignPermissionToRole
};
