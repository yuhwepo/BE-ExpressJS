const expireCache = require('expire-cache');
const db = require('../database/knex-connection');

const cacheService = {
    async setOneUser(userId) {
        const rolePermissions = await db
            .select('r.name AS role', 'p.type AS permission')
            .from('role AS r')
            .join('user_role AS ur', 'r.id', '=', 'ur.roleID')
            .leftJoin('role_permission AS rp', 'r.id', '=', 'rp.roleID')
            .leftJoin('permission AS p', 'rp.permissionID', '=', 'p.id')
            .where('ur.userID', userId);

        const roles = Array.from(new Set(rolePermissions.map((item) => item.role)));
        const permissions = Array.from(
            new Set(rolePermissions.filter((item) => item.permission != null).map((item) => item.permission))
        );
        const userCache = expireCache.namespace('userCache');
        userCache(`${userId}`, { roles, permissions }, process.env.JWT_EXPIRE_TIME);
    },
    async getOneUser(userId) {
        const userCache = expireCache.namespace('userCache');
        if (!userCache) {
            return null;
        }

        return userCache(`${userId}`);
    },
    async getAllUser() {
        const userCache = expireCache.namespace('userCache');

        if (!userCache) {
            return null;
        }

        return userCache();
    },
};

Object.freeze(cacheService);

module.exports = {
    cacheService,
};