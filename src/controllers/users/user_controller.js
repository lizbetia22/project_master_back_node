const express = require('express');
const router = express.Router();
const userRepository = require('../../repositories/users/user_repository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {sign} = require("jsonwebtoken");
const { body, validationResult } = require('express-validator');
const userPostRepository = require("../../repositories/users/user_post_repository");

router.post('/seeder', async (req, res) => {
    const users = [
        {
            id_role: 1,
            name: 'Admin',
            email: 'admin@gmail.com',
            password: 'azerty'
        },
        {
            id_role: 2,
            name: 'John Doe',
            email: 'john.doe@gmail.com',
            password: 'azerty'
        },
        {
            id_role: 3,
            name: 'Ben Doe',
            email: 'ben.doe@gmail.com',
            password: 'azerty'
        },
        {
            id_role: 3,
            name: 'Rhone Fen',
            email: 'rhone.fen@gmail.com',
            password: 'azerty'
        },
        {
            id_role: 4,
            name: 'Julian Gen',
            email: 'julian.gen@gmail.com',
            password: 'azerty'
        }
    ];

    try {
        for (const user of users) {
            await userRepository.createUser(user);
        }
        res.status(200).send('Seeded users successfully!');
    } catch (err) {
        console.log(err);
        res.status(500).send('Failed to seed users.');
    }
});

router.get('/all', async (req, res) => {
    try {
        const users = await userRepository.getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to get users.');
    }
});

router.get('/workshop', async (req, res) => {
    try {
        const users = await userRepository.findUsersByRoleWorkshop();
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to get users from workshop.');
    }
});

router.post('/create', async (req, res) => {
    try {
        const userData = req.body;
        const user = await userRepository.createUser(userData);
        res.status(201).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to create user.');
    }
});
router.post('/login',
    body('email').isEmail(),
    body('password').isLength({ min: 4 }),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { email, password } = req.body;
            const foundUser = await userRepository.findUserByEmail(email);
            if (!foundUser) {
                return res.status(401).send('Invalid email or password.');
            }

            const login = bcrypt.compareSync(password, foundUser.password);
            if (login) {
                const roleName = foundUser.Role.name;
                const token = jwt.sign(
                    { id: foundUser.id, role: roleName, name: foundUser.name },
                    process.env.SECRET_KEY,
                    { expiresIn: process.env.JWT_EXPIRES_IN }
                );
                res.status(200).json({ token });
            } else {
                res.status(401).send('Invalid email or password.');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error.');
        }
    }
);

router.get('/refresh/:id_user', async (req, res) => {
    try {
        const id_user = req.params.id_user;

        const token = jwt.sign(
            { id_user },
            process.env.SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error.');
    }
});

router.get('/posts/:id_user', async (req, res) => {
    try {
        const id_user = req.params.id_user;

        const user_posts = await userRepository.getPostsByUserId({ id_user });

        res.status(200).json(user_posts);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error.');
    }
});

router.get('/commerce', async (req, res) => {
    try {
        const users = await userRepository.findUsersByRoleCommerce();
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to get users.');
    }
});

router.put('/update/:id_user',
    body('name').isString(),
    body('email').isEmail(),
    body('id_role').isNumeric(),
    body('password').isLength({ min: 4 }),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { id_user } = req.params;
            const userData = req.body;

            const updatedUser = await userRepository.updateUser(id_user, userData);

            if (updatedUser.id_role === 3) {
                const updatedPosts = await userRepository.updateUserPosts(id_user, userData.posts || []);
            }

            res.status(200).json(updatedUser);
        } catch (error) {
            console.error(error);
            res.status(500).send('Failed to update user.');
        }
    }
);

router.post('/create-user',
    body('name').notEmpty().isString(),
    body('email').isEmail(),
    body('password').isLength({ min: 4 }),
    body('id_role').isInt(),
    body('posts').optional().isArray(),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const userData = req.body;
            const createdUser = await userRepository.createUser(userData);

            if (createdUser.id_role === 3 && userData.posts) {
                await userRepository.addPostsToUser(createdUser.id, userData.posts);
            }

            res.status(201).json(createdUser);
        } catch (error) {
            console.error(error);
            res.status(500).send('Failed to create user.');
        }
    }
);

router.delete('/delete/:id_user', async (req, res) => {
    try {
        const { id_user } = req.params;

        const relatedRecords = await userRepository.checkUserReferences(id_user);

        if (relatedRecords > 0) {
            return res.status(400).send('Cannot delete user because they have related records.');
        }

        await userRepository.deleteUser(id_user);

        res.status(200).send('User deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to delete user.');
    }
});



exports.initializeRoutes = () => router;