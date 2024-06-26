const express = require('express');
const router = express.Router();
const devisPieceRepository = require('../../repositories/commerce/devis_piece_repository');
const {Devis_piece} = require("../../models/commerce/devis_piece");
const {sequelize} = require("../../models/database");
const {Devis} = require("../../models/commerce/devis");
router.post('/seeder', async (req, res) => {
    const devisPiecesData = [
        {
            id_devis: 1,
            id_piece: [1, 2, 3],
            quantity: [10, 22, 13],
            price: [44, 100, 15],
        },
        {
            id_devis: 2,
            id_piece: [5, 6],
            quantity: [20, 7],
            price: [50, 11],
        },
        {
            id_devis: 3,
            id_piece: [3],
            quantity: [30],
            price: [70],
        },
        {
            id_devis: 4,
            id_piece: [4, 7, 2],
            quantity: [10, 5, 4],
            price: [20, 30, 40],
        },
        {
            id_devis: 5,
            id_piece: [5, 4],
            quantity: [3, 7],
            price: [25, 70],
        },
    ];

    try {
        for (const devisPiece of devisPiecesData) {
            const { id_devis, id_piece, quantity, price } = devisPiece;

            if (Array.isArray(id_piece)) {
                for (let i = 0; i < id_piece.length; i++) {
                    await devisPieceRepository.createDevisPiece({
                        id_devis,
                        id_piece: id_piece[i],
                        quantity: quantity[i],
                        price: price[i],
                    });
                }
            } else {
                await devisPieceRepository.createDevisPiece(devisPiece);
            }
        }

        res.status(200).send('Seeded devis pieces successfully!');
    } catch (err) {
        console.log(err);
        res.status(500).send('Failed to seed devis pieces.');
    }
});


router.post('/create', async (req, res) => {
    try {
        const devisPieceData = req.body;
        const devisPiece = await devisPieceRepository.createDevisPiece(devisPieceData);
        res.status(201).json(devisPiece);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to create devis piece.');
    }
});

router.get('/all', async (req, res) => {
    try {
        const devisPieces = await devisPieceRepository.getAllDevisPieces();
        res.status(200).json(devisPieces);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to get devis pieces.');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const devisPiece = await devisPieceRepository.getDevisPieceById(id);
        if (!devisPiece) {
            res.status(404).send('Devis piece not found.');
        } else {
            res.status(200).json(devisPiece);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to get devis piece.');
    }
});

router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedDevisPiece = await devisPieceRepository.updateDevisPiece(id, updateData);
        res.status(200).json(updatedDevisPiece);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to update devis piece.');
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await devisPieceRepository.deleteDevisPiece(id);
        res.status(200).send('Devis piece deleted successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to delete devis piece.');
    }
});

router.post('/create-devis', async (req, res) => {
    const { id_user, date, deadline, pieces } = req.body;

    if (!id_user || !date || !deadline || !pieces) {
        return res.status(400).send('Missing required fields.');
    }

    const { id_piece, quantity, price } = pieces.reduce((acc, piece) => {
        acc.id_piece.push(piece.id_piece);
        acc.quantity.push(piece.quantity);
        acc.price.push(piece.price);
        return acc;
    }, { id_piece: [], quantity: [], price: [] });

    if (id_piece.length !== quantity.length || id_piece.length !== price.length) {
        return res.status(400).send('Each piece in the pieces array must have id_piece, quantity, and price.');
    }

    try {
        const result = await sequelize.transaction(async (t) => {
            const devis = await Devis.create(
                { id_user, date, deadline },
                { transaction: t }
            );

            const devisPiecesData = id_piece.map((pieceId, index) => ({
                id_devis: devis.id,
                id_piece: pieceId,
                quantity: quantity[index],
                price: price[index]
            }));

            await Devis_piece.bulkCreate(devisPiecesData, { transaction: t });

            return devis;
        });

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to create devis and devis pieces.');
    }
});



exports.initializeRoutes = () => router;

