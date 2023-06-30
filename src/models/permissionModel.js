const db = require('../database/knex-connection');

const create = async (type) => {
    try {
        const [id] = await db("permission").insert({ type } );

        return { id, type };
    } catch (error) {
        throw error;
    }
};

const findAll = async () => {
    try {
        return await db("permission").select();
    } catch (error) {
        throw error;
    }
}

const findById = async (id) => {
    try {
        return await db("permission").select().where({ id }).first();
    } catch (error) {
        throw error;
    }
}

const updateById = async (id, type) => {
    try {
       await db("permission").where({ id }).update({ type });

       const [updatedPermission] = await db("permission").select().where({ id });

       return updatedPermission;
    } catch (error) {
        throw error;
    }
};

const deleteById = async (id) => {
    try {
        const del = await db("permission").where({ id }).del();
        return del;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    create,
    findAll,
    findById,
    updateById,
    deleteById
}