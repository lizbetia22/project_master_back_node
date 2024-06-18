const express = require('express');
const operationRepository = require('../../repositories/workshop/operation_repository');
const router = express.Router();

router.post('/seeder', async (req, res) => {
    const operations = [
        { id_post: 1, id_machine: 1, name: "Milling ", time: 12 },
        { id_post: 2, id_machine: 2, name: "Drilling ", time: 53 },
        { id_post: 3, id_machine: 3, name: "Welding ", time: 44 },
        { id_post: 4, id_machine: 4, name: "Forming ", time: 18 },
        { id_post: 5, id_machine: 5, name: "Assembling ", time: 33 },
        { id_post: 6, id_machine: 6, name: "Polishing ", time: 45 },
        { id_post: 7, id_machine: 7, name: "Casting ", time: 60 },
        { id_post: 8, id_machine: 8, name: "Forging ", time: 39 },
        { id_post: 9, id_machine: 9, name: "Stamping ", time: 58 },
        { id_post: 10, id_machine: 10, name: "Painting ", time: 14 },
    ];

    try {
        for (const operation of operations) {
            await operationRepository.createOperation(operation);
        }
        res.status(200).send('Seeded operations successfully!');
    } catch (err) {
        console.log(err);
        res.status(500).send('Failed to seed operations.');
    }
});
router.get('/all', async (req, res) => {
    try {
        const operations = await operationRepository.getAllOperations();
        res.json(operations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const operation = await operationRepository.getOperationById(req.params.id);
        if (operation) {
            res.json(operation);
        } else {
            res.status(404).json({ error: 'Operation not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/create', async (req, res) => {
    try {
        const operation = await operationRepository.createOperation(req.body);
        res.status(201).json(operation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



exports.initializeRoutes = () => router;
