const { User_post } = require('../../models/users/user_post');
const {User} = require("../../models/users/user");
const {Post} = require("../../models/users/post");

exports.createUserPost = async ({ id_user, id_post }) => {
    return User_post.create({
        id_user,
        id_post,
    });
};

exports.getAllUserPosts = async () => {
    try {
        return await User_post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['name'], // Include only the 'name' attribute from User
                },
                {
                    model: Post,
                    attributes: ['name'], // Include only the 'name' attribute from Post
                },
            ],
        });
    } catch (error) {
        throw error;
    }
};

exports.getUserPostById = async (id) => {
    try {
        return await User_post.findByPk(id);
    } catch (error) {
        throw error;
    }
};

