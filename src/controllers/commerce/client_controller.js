const express = require('express');
const clientRepository = require('../../repositories/commerce/client_repository');
const router = express.Router();

router.post('/seeder', async (req, res) => {
    const clients = [
        { name: 'Client 1' },
        { name: 'Client 2' },
        { name: 'Client 3' },
        { name: 'Client 4' },
        { name: 'Client 5' },
    ];

    try {
        for (const client of clients) {
            await clientRepository.createClient(client);
        }
        res.status(200).send('Seeded clients successfully!');
    } catch (err) {
        console.log(err);
        res.status(500).send('Failed to seed clients.');
    }
});

router.post('/create', async (req, res) => {
    try {
        const client = await clientRepository.createClient(req.body);
        res.status(201).json(client);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/all', async (req, res) => {
    try {
        const clients = await clientRepository.getAllClients();
        res.json(clients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const client = await clientRepository.getClientById(req.params.id);
        if (client) {
            res.json(client);
        } else {
            res.status(404).json({ error: 'Client not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

exports.initializeRoutes = () => router;
