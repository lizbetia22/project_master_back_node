const express = require('express');
const router = express.Router();
const roleRepository = require('../../repositories/users/role_repository');

router.post('/seeder', async (req, res) => {
    const roles = [
        { name: 'Admin' },
        { name: 'Commercial' },
        { name: 'Workshop' }
    ];

    try {
        for (const role of roles) {
            await roleRepository.createRole(role);
        }
        res.status(200).send('Seeded roles successfully!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to seed roles.');
    }
});

router.get('/all', async (req, res) => {
    try {
        const roles = await roleRepository.getAllRoles();
        res.status(200).json(roles);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to get roles.');
    }
});

exports.initializeRoutes = () => router;
