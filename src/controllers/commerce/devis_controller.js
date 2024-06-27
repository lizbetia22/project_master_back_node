const express = require('express');
const router = express.Router();
const devisRepository = require('../../repositories/commerce/devis_repository');

router.post('/seeder', async (req, res) => {
    const devisData = [
        {
            id_client: 1,
            date: new Date('2024-01-01'),
            deadline: new Date('2024-01-31'),
        },
        {
            id_client: 2,
            date: new Date('2024-02-01'),
            deadline: new Date('2024-02-28'),
        },
        {
            id_client: 3,
            date: new Date('2024-03-01'),
            deadline: new Date('2024-03-31'),
        },
        {
            id_client: 4,
            date: new Date('2024-04-01'),
            deadline: new Date('2024-04-30'),
        },
        {
            id_client: 5,
            date: new Date('2024-05-01'),
            deadline: new Date('2024-05-31'),
        },
    ];

    try {
        for (const devis of devisData) {
            await devisRepository.createDevis(devis);
        }
        res.status(200).send('Seeded devis successfully!');
    } catch (err) {
        console.log(err);
        res.status(500).send('Failed to seed devis.');
    }
});


router.post('/create', async (req, res) => {
    try {
        const devisData = req.body;
        const devis = await devisRepository.createDevis(devisData);
        res.status(201).json(devis);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to create devis.');
    }
});

router.get('/all', async (req, res) => {
    try {
        const devisList = await devisRepository.getAllDevis();
        res.status(200).json(devisList);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to get devis.');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const devis = await devisRepository.getDevisById(id);
        if (!devis) {
            res.status(404).send('Devis not found.');
        } else {
            res.status(200).json(devis);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to get devis.');
    }
});

router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedDevis = await devisRepository.updateDevis(id, updateData);
        res.status(200).json(updatedDevis);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to update devis.');
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await devisRepository.deleteDevis(id);
        res.status(200).send('Devis deleted successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to delete devis.');
    }
});

exports.initializeRoutes = () => router;
