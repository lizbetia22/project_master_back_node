const { Post } = require('../../models/users/post');
const {Role} = require("../../models/users/roles");
const {Machine} = require("../../models/workshop/machines");

exports.createPost = async (postData) => {
    try {
        return await Post.create(postData);
    } catch (error) {
        throw error;
    }
};

exports.getAllPosts = async () => {
    try {
        return await Post.findAll(
            {
                order: [['id', 'ASC']],
                include: {
                    model: Machine,
                    attributes: ['id']
                }
            }
        );
    } catch (error) {
        throw error;
    }
};

exports.getPostById = async (id) => {
    try {
       return await Post.findByPk(id);
    } catch (error) {
        throw error;
    }
};

exports.updatePost = async (id, updateData) => {
    try {
        const [updated] = await Post.update(updateData, {
            where: { id: id }
        });
        if (updated) {
            return await Post.findByPk(id);
        }
        console.error('Post not found');
    } catch (error) {
        throw error;
    }
};

exports.deletePost = async (id) => {
    try {
        const deleted = await Post.destroy({
            where: { id: id }
        });
        if (deleted) {
            return true;
        }
       console.error('Post not found');
    } catch (error) {
        throw error;
    }
};

