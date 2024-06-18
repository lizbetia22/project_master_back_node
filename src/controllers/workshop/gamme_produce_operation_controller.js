const express = require('express');
const GammeOperationProduceRepository = require('../../repositories/workshop/gamme_produce_operation_repository');
const router = express.Router();

router.post('/seeder', async (req, res) => {
    const gammeProduceOperations = [
        { id_gamme_operation:1, id_post: 1, id_machine: 1, name: "Milling ", time: 15 },
        { id_gamme_operation:3, id_post: 3, id_machine: 2, name: "Drilling ", time: 55 },
        { id_gamme_operation:5, id_post: 7, id_machine: 5, name: "Welding ", time: 37 },
        { id_gamme_operation:7, id_post: 7, id_machine: 7, name: "Forming ", time: 17 },
        { id_gamme_operation:8, id_post: 4, id_machine: 2, name: "Assembling ", time: 21 },
        { id_gamme_operation:9, id_post: 6, id_machine: 1, name: "Polishing ", time: 47 },
        { id_gamme_operation:10,id_post: 5,id_machine: 3, name: "Casting ", time: 58 },
        { id_gamme_operation:11, id_post: 9, id_machine: 9, name: "Forging ", time: 11 },
        { id_gamme_operation:12, id_post: 2, id_machine: 6, name: "Stamping ", time: 29 },
        { id_gamme_operation:14, id_post: 8, id_machine: 4, name: "Painting ", time: 19 }
    ];

    try {
        for (const gammeProduceOperation of gammeProduceOperations) {
            await GammeOperationProduceRepository.createGammProduceOperation(gammeProduceOperation);
        }
        res.status(200).send('Seeded gammeProduceOperations successfully!');
    } catch (err) {
        console.log(err);
        res.status(500).send('Failed to seed gammeProduceOperations');
    }
});
router.get('/all', async (req, res) => {
    try {
        const gammeProduceOperations = await GammeOperationProduceRepository.getAllGammeProduceOperations();
        res.json(gammeProduceOperations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const gammeProduceOperation = await GammeOperationProduceRepository.getGammeProduceOperationById(req.params.id);
        if (gammeProduceOperation) {
            res.json(gammeProduceOperation);
        } else {
            res.status(404).json({ error: 'GammeProduceOperation not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/create', async (req, res) => {
    try {
        const gammeProduceOperation = await GammeOperationProduceRepository.createGammProduceOperation(req.body);
        res.status(201).json(gammeProduceOperation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/update/:id', async (req, res) => {
    try {
        const updatedGammeProduceOperation = await GammeOperationProduceRepository.updateGammeProduceOperation(req.params.id, req.body);
        res.json(updatedGammeProduceOperation);
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
        await GammeOperationProduceRepository.deleteGammeProduceOperation(req.params.id);
        res.status(200).json({ message: 'GammeProduceOperation successfully deleted' });
    } catch (err) {
        if (err.message.includes('not found')) {
            res.status(404).json({ error: err.message });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});


exports.initializeRoutes = () => router;
