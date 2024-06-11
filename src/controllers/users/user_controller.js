const express = require('express');
const router = express.Router();
const userRepository = require('../../repositories/users/user_repository');

router.post('/seeder', async (req, res) => {
    const users = [
        {
            id_role: 1,
            name: 'Admin admin',
            email: 'admin@gmail.com',
            password: 'azerty'
        },
        {
            id_role: 2,
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: 'azerty'
        },
        {
            id_role: 3,
            name: 'Ben Doe',
            email: 'bendoe@gmail.com',
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

exports.initializeRoutes = () => router;