const { User } = require('../../models/users/user'); // Assuming your model file is in ../models
const bcrypt = require('bcryptjs');


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

        await User.create(user);
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