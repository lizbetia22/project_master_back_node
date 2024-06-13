const express = require('express');
const router = express.Router();
const userRepository = require('../../repositories/users/user_repository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {sign} = require("jsonwebtoken");
const { body, validationResult } = require('express-validator');

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
                    { id: foundUser.id, role: roleName  },
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

exports.initializeRoutes = () => router;