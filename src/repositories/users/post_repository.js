const { Post } = require('../../models/users/post');

exports.createPost = async (postData) => {
    try {
        return await Post.create(postData);
    } catch (error) {
        throw error;
    }
};

exports.getAllPosts = async () => {
    try {
        return await Post.findAll();
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

