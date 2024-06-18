const express = require('express');
const postRepository = require('../../repositories/users/post_repository');
const router = express.Router();

router.post('/seeder', async (req, res) => {
    const posts = [
        { name: 'Tailor' },
        { name: 'Pattern Maker' },
        { name: 'Seamstress' },
        { name: 'Textile Technician' },
        { name: 'Production Manager' },
        { name: 'Cutter' },
        { name: 'Sewing Machine Operator' },
        { name: 'Quality Control Inspector' },
        { name: 'Embroidery Machine Operator' },
        { name: 'Sales Associate' },
        { name: 'Cashier' },
        { name: 'Store Manager' },
        { name: 'Visual Merchandiser' },
        { name: 'Customer Service Representative' }
    ];

    try {
        for (const post of posts) {
            await postRepository.createPost(post);
        }
        res.status(200).send('Seeded posts successfully!');
    } catch (err) {
        console.log(err);
        res.status(500).send('Failed to seed posts.');
    }
});
router.get('/all', async (req, res) => {
    try {
        const posts = await postRepository.getAllPosts();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const post = await postRepository.getPostById(req.params.id);
        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ error: 'Post not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/create', async (req, res) => {
    try {
        const post = await postRepository.createPost(req.body);
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



exports.initializeRoutes = () => router;
