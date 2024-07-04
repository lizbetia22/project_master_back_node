const express = require('express');
const userPostRepository = require('../../repositories/users/user_post_repository');
const gammePostRepository = require('../../repositories/workshop/gamme_repository');
const router = express.Router();

router.post('/seeder', async (req, res) => {
    const userPosts = [
        { id_user: 3, id_post: [7, 1, 2, 4] },
        { id_user: 4, id_post: [5, 6] },
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
        const { id_user, id_post } = req.body;
        const userPosts = await userPostRepository.createUserPost({ id_user, id_post });
        res.status(201).json(userPosts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get('/posts/gammes', async (req, res) => {
    try {
        const userPosts = await userPostRepository.getAllUserPosts();
        const userGammes = await gammePostRepository.getAllGammes();
        console.log('zebi')
        console.log('userPosts:', JSON.stringify(userPosts, null, 2));
        console.log('userGammes:', JSON.stringify(userGammes, null, 2));

        const filteredUsers = userPosts
            .filter(up => up.User.Role && (up.User.Role.name === 'Workshop' || up.User.Role.name === 'Responsible'))
            .map(up => ({
                id: up.id_user,
                userName: up.User.name,
                roleName: up.User.Role.name,
                postName: up.Post.name,
            }));

        const result = filteredUsers.reduce((acc, user) => {
            let userData = acc.find(u => u.id === user.id);
            if (!userData) {
                userData = {
                    id: user.id,
                    userName: user.userName,
                    roleName: user.roleName,
                    postName: [],
                    gammeName: []
                };
                acc.push(userData);
            }
            if (!userData.postName.includes(user.postName)) {
                userData.postName.push(user.postName);
            }
            return acc;
        }, []);

        console.log("result1", result)

        userGammes.forEach(ug => {
            if (ug.User.Role && (ug.User.Role.name === 'Workshop' || ug.User.Role.name === 'Responsible')) {
                console.log("je rentre ici")
                const userData = result.find(u => u.id === ug.User.id);
                if (userData && !userData.gammeName.includes(ug.name)) {
                    console.log("je rentre la")
                    userData.gammeName.push(ug.name);
                }
            }
        });

        console.log('result:', JSON.stringify(result, null, 2));

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


exports.initializeRoutes = () => router;
