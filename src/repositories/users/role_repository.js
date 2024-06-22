const { Role } = require('../../models/users/roles');

exports.createRole = async (roleData) => {
    try {
        await Role.create(roleData);
    } catch (error) {
        throw error;
    }
};

exports.getAllRoles = async () => {
    try {
        return await Role.findAll(
            {
                order: [['id', 'ASC']]
            }
        );
    } catch (error) {
        throw error;
    }
};
