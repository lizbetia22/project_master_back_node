const { User } = require('../../models/users/user'); // Assuming your model file is in ../models
const bcrypt = require('bcryptjs');
const {Role} = require("../../models/users/roles");
const {User_post} = require("../../models/users/user_post");
const {Post} = require("../../models/users/post");
const {Piece} = require("../../models/workshop/piece");


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
        return await User.findAll(
            {
                order: [['id', 'ASC']],
                include: [
                    {
                        model: Role,
                        attributes: ['name'],
                    },
                    {
                        model: User_post,
                        attributes: ['id'],
                        include : [
                            {
                                model: Post,
                                attributes: ['name'],
                            }
                        ]
                    },
                ]
            }
        );
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
}

exports.findUsersByRoleCommerce = async () => {
    try {
        return await User.findAll({
            where: { id_role: 2  },
        });
    } catch (error) {
        throw error;
    }
}

exports.getPostsByUserId = async (id_user) => {
    try {
        const user_id = id_user.id_user

        return await User_post.findAll({
            include: {
                model: Post,
                attributes: ['id','name']
            },
            where: { id_user: user_id},
        });
    } catch (error) {
        throw error;
    }
}