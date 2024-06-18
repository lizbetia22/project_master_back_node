const express = require('express');
const GammeOperationRepository = require('../../repositories/workshop/gamme_operation_repository');
const router = express.Router();

router.post('/seeder', async (req, res) => {
    const gammeOperations = [
        { id_operation: 1, id_gamme: 5, time: 12 },
        { id_operation: 2, id_gamme: 2, time: 27 },
        { id_operation: 3, id_gamme: 4, time: 58 },
        { id_operation: 4, id_gamme: 3, time: 36 },
        { id_operation: 5, id_gamme: 1, time: 44 },
        { id_operation: 6, id_gamme: 2, time: 29 },
        { id_operation: 7, id_gamme: 1, time: 10 },
        { id_operation: 8, id_gamme: 4, time: 17 },
        { id_operation: 9, id_gamme: 3, time: 39 },
    ];
    try {
        for (const gammeOperation of gammeOperations) {
            await GammeOperationRepository.createGammeOperation(gammeOperation);
        }
        res.status(200).send('Seeded gammeOperations successfully!');
    } catch (err) {
        console.log(err);
        res.status(500).send('Failed to seed gammeOperations');
    }
});
router.get('/all', async (req, res) => {
    try {
        const gammeOperations = await GammeOperationRepository.getAllGammeOperations();
        res.json(gammeOperations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const gammeOperation = await GammeOperationRepository.getGammeOperationById(req.params.id);
        if (gammeOperation) {
            res.json(gammeOperation);
        } else {
            res.status(404).json({ error: 'GammeOperation not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/create', async (req, res) => {
    try {
        const gammeOperation = await GammeOperationRepository.createGammeOperation(req.body);
        res.status(201).json(gammeOperation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/update/:id', async (req, res) => {
    try {
        const updatedGammeOperation = await GammeOperationRepository.updateGammeOperation(req.params.id, req.body);
        res.json(updatedGammeOperation);
    } catch (err) {
        if (err.message.includes('not found')) {
            res.status(404).json({ error: err.message });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        await GammeOperationRepository.deleteGammeOperation(req.params.id);
        res.status(200).json({ message: 'GammeOperation successfully deleted' });
    } catch (err) {
        if (err.message.includes('not found')) {
            res.status(404).json({ error: err.message });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});


exports.initializeRoutes = () => router;
