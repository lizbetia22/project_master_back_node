const { User_post } = require('../../models/users/user_post');
const {User} = require("../../models/users/user");
const {Post} = require("../../models/users/post");
const {Role} = require("../../models/users/roles");

// exports.createUserPost = async ({ id_user, id_post }) => {
//     return User_post.create({
//         id_user,
//         id_post,
//     });
// };

exports.createUserPost = async ({ id_user, id_post }) => {
    const userPosts = [];

    // If id_post is not an array, convert it to an array
    const postIds = Array.isArray(id_post) ? id_post : [id_post];

    for (const postId of postIds) {
        const userPost = await User_post.create({
            id_user,
            id_post: postId,
        });
        userPosts.push(userPost);
    }

    return userPosts;
};


exports.getAllUserPosts = async () => {
    try {
        return await User_post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: Role,
                            attributes: ['name'],
                        },
                    ],
                },
                {
                    model: Post,
                    attributes: ['name'],
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


