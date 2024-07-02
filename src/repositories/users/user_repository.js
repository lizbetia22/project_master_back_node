const { User } = require('../../models/users/user'); // Assuming your model file is in ../models
const bcrypt = require('bcryptjs');
const {Role} = require("../../models/users/roles");
const {User_post} = require("../../models/users/user_post");
const {Post} = require("../../models/users/post");
const {Piece} = require("../../models/workshop/piece");
const {Gamme} = require("../../models/workshop/gamme");


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
                        attributes: ['id','name'],
                    },
                    {
                        model: User_post,
                        attributes: ['id'],
                        include : [
                            {
                                model: Post,
                                attributes: ['id','name'],
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

exports.updateUser = async (id_user, userData) => {
    try {
        const user = await User.findByPk(id_user);

        if (!user) {
          console.error('User not found');
        }
        if (userData.password) {
            const salt = bcrypt.genSaltSync(10);
            userData.password = bcrypt.hashSync(userData.password, salt);
        }

        await user.update(userData);

        return await user.reload();
    } catch (error) {
        throw error;
    }
};

exports.updateUserPosts = async (id_user, posts) => {
    try {
        await User_post.destroy({ where: { id_user } });

        const userPosts = posts.map(postId => ({
            id_user,
            id_post: postId
        }));

        return await User_post.bulkCreate(userPosts);
    } catch (error) {
        throw error;
    }
};

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

exports.addPostsToUser = async (userId, postIds) => {
    try {
        const userPosts = postIds.map(postId => ({
            id_user: userId,
            id_post: postId
        }));

        return await User_post.bulkCreate(userPosts);
    } catch (error) {
        throw error;
    }
};

exports.deleteUser = async (id_user) => {
    try {
        const user = await User.findByPk(id_user);

        if (!user) {
            console.error('User not found');
        }

        await User_post.destroy({ where: { id_user } });
        await user.destroy();
    } catch (error) {
        throw error;
    }
};

exports.checkUserReferences = async (id_user) => {
    try {
        const userPosts = await User_post.count({ where: { id_user } });
        const userGammes = await Gamme.count({ where: { id_user } });
        return userPosts + userGammes;
    } catch (error) {
        throw error;
    }
};