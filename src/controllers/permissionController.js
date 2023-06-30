const Permission = require("../models/permissionModel");

const createPermission = async (req, res) => {
    try {
        const { type } = req.body;

        const permission = await Permission.create(type);

        return res.status(201).json({ success: true, permission });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error });
    }
};

const getPermissions = async (req, res) => {
    try {
        const permissions = await Permission.findAll();

        return res.status(200).json({ success: true, permissions });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error });
    }
};

const getPermissionById = async (req, res) => {
    try {
        const { id } = req.params;

        const permission = await Permission.findById(id);

        if (!permission) {
            return res.status(404).json({ success: false, message: "Permission not found" });
        }

        return res.status(200).json({ success: true, permission });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error });
    }
}

const updatePermission = async (req, res) => {
    try {
        const { id } = req.params;
        const { type } = req.body;

        const permission = await Permission.updateById(id, type);

        if (!permission) {
            return res.status(404).json({success: false, message: "Permission not found"});
        }

        return res.status(200).json({ success: true, permission });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error });
    }
};

const deletePermission = async (req, res) => {
    try {
        const { id } = req.params;

        await Permission.deleteById(id);

        return res.status(200).json({ success: true});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error });
    }
}

module.exports = {
    createPermission,
    getPermissions,
    getPermissionById,
    updatePermission,
    deletePermission
}