const express = require('express');
const router = express.Router();
const devisPieceRepository = require('../../repositories/commerce/devis_piece_repository');
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

exports.initializeRoutes = () => router;

