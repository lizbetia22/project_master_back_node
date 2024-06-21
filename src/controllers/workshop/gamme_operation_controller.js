const express = require('express');
const GammeOperationRepository = require('../../repositories/workshop/gamme_operation_repository');
const {Gamme_operation} = require("../../models/workshop/gamme_operation");
const {Gamme} = require("../../models/workshop/gamme");
const {sequelize} = require("../../models/database");
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

router.get('/gamme/:id_gamme', async (req, res, next) => {
    const id_gamme = req.params.id_gamme;
    try {
        const gammeOperations = await GammeOperationRepository.findByGammeId(id_gamme);
        res.json(gammeOperations);
    } catch (error) {
        next(error);
    }
});

router.post('/create/gamme', async (req, res) => {
    const { id_piece, id_user, name, operations } = req.body;

    if (!id_piece || !id_user || !name || !operations || !Array.isArray(operations)) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    let transaction;
    try {
        transaction = await sequelize.transaction();
        const gamme = await Gamme.create({ id_piece, id_user, name }, { transaction });
        const gammeOperations = await Promise.all(operations.map(operation =>
            Gamme_operation.create({
                id_gamme: gamme.id,
                id_operation: operation.id_operation,
                time: operation.time
            }, { transaction })
        ));
        await transaction.commit();
        res.status(201).json({ gamme, gammeOperations });
    } catch (error) {
        if (transaction) await transaction.rollback();
        res.status(500).json({ message: error.message });
    }
});

router.put('/update/gammeOperations/:id', async (req, res) => {
    const { id } = req.params;
    const { id_piece, id_user, name, operations } = req.body;

    if (!id_piece || !id_user || !name || !operations || !Array.isArray(operations)) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const result = await GammeOperationRepository.updateGammeAndOperations(id, { id_piece, id_user, name }, operations);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


exports.initializeRoutes = () => router;
