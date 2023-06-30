const db = require("../database/knex-connection");

const create = async (name) => {
	try {
		const [id] = await db("role").insert({ name });
		return { id, name };
	} catch (err) {
		throw err;
	}
};

const findAll = async () => {
	try {
		return await db("role").select();
	} catch (err) {
		throw err;
	}
};

const findById = async (id) => {
	try {
		return await db("role").select().where({ id }).first();
	} catch (err) {
		throw err;
	}
};

const updateById = async (id, name) => {
	try {
		await db("role").update({ name }).where({ id });
		const [updatedRole] = await db("role").select().where({ id });

		return updatedRole;
	} catch (err) {
		throw err;
	}
};

const deleteById = async (id) => {
	try {
		const del = await db("role").del().where({ id });
		return del;
	} catch (err) {
		console.log(err);
		throw err;
	}
};

const checkPermissionAssignment = async (roleId, permissionId) => {
	const assignment = await db("role_permission")
		.where("roleID", roleId)
		.where("permissionID", permissionId)
		.first();

	return !!assignment;
};

const assignPermission = async (roleId, permissionId) => {
	try {
		const role = await findById(roleId);
		const permission = await db("permission")
			.where("id", permissionId)
			.first();

		if (!role || !permission) {
			throw new Error("Role or permission not found");
		}

		const existingAssignment = await checkPermissionAssignment(roleId, permissionId);

		if (existingAssignment) {
			throw new Error("Permission already assigned to role");
		}

		await db("role_permission").insert({
			roleID: roleId,
			permissionID: permissionId,
		});

		return true;
	} catch (error) {
		console.log(error);
		throw new Error("Failed to assign permission to role");
	}
};

module.exports = {
	create,
	findAll,
	findById,
	updateById,
	deleteById,
	assignPermission,
};
