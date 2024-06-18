const express = require('express');
const userPostRepository = require('../../repositories/users/user_post_repository');
const router = express.Router();

router.post('/seeder', async (req, res) => {
    const userPosts = [
        { id_user: 1, id_post: [1, 3, 4] },
        { id_user: 2, id_post: [5, 6] },
        { id_user: 3, id_post: [7, 1, 2, 4] },
    ];

    try {
        for (const userPost of userPosts) {
            const { id_user, id_post } = userPost;
            for (const postId of id_post) {
                await userPostRepository.createUserPost({ id_user, id_post: postId });
            }
        }
        res.status(200).send('Seeded user posts successfully!');
    } catch (err) {
        console.log(err);
        res.status(500).send('Failed to seed user posts.');
    }
});
router.get('/all', async (req, res) => {
    try {
        const userPosts = await userPostRepository.getAllUserPosts();
        res.json(userPosts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const userPost = await userPostRepository.getUserPostById(req.params.id);
        if (userPost) {
            res.json(userPost);
        } else {
            res.status(404).json({ error: 'User post not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/create', async (req, res) => {
    try {
        const userPost = await userPostRepository.createUserPost(req.body);
        res.status(201).json(userPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



exports.initializeRoutes = () => router;
