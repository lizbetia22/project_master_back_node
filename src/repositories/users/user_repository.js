const { User } = require('../../models/users/user'); // Assuming your model file is in ../models
const bcrypt = require('bcryptjs');
const {Role} = require("../../models/users/roles");


exports.createUser = async (userData) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(userData.password, salt);

        const user = {
            id_role: userData.id_role,
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
        };

        return await User.create(user);
    } catch (error) {
        throw error;
    }
};

exports.getAllUsers = async () => {
    try {
        return await User.findAll();
    } catch (error) {
        throw error;
    }
};

exports.findUserByEmail = async (email) => {
    try {
        return await User.findOne({
            where: { email },
            include: {
                model: Role,
                attributes: ['name']
            }
        });
    } catch (error) {
        throw error;
    }
};

exports.findUsersByRoleWorkshop = async () => {
    try {
        return await User.findAll({
            where: { id_role: 4  },
        });
    } catch (error) {
        throw error;
    }
};