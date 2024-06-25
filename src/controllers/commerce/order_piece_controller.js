const express = require('express');
const router = express.Router();
const orderPieceRepository = require('../../repositories/commerce/order_piece_repository');
router.post('/seeder', async (req, res) => {
    const orderPiecesData = [
        {
            id_order: 1,
            id_pieces: [1, 2, 3],
            quantity: [10, 55, 5],
            price: [20, 4, 50],
        },
        {
            id_order: 2,
            id_pieces: [5],
            quantity: [20],
            price: [250],
        },
        {
            id_order: 3,
            id_pieces: [4, 3],
            quantity: [23, 45],
            price: [36, 79],
        },
        {
            id_order: 4,
            id_pieces: [1, 6],
            quantity: [20, 3],
            price: [130, 111],
        },
        {
            id_order: 5,
            id_pieces: [2],
            quantity: [50],
            price: [44],
        },
    ];

    try {
        for (const orderPieceData of orderPiecesData) {
            const { id_order, id_pieces, quantity, price } = orderPieceData;

            if (Array.isArray(id_pieces)) {
                for (let i = 0; i < id_pieces.length; i++) {
                    await orderPieceRepository.createOrderPiece({
                        id_order,
                        id_piece: id_pieces[i],
                        quantity: quantity[i],
                        price: price[i],
                    });
                }
            } else {
                await orderPieceRepository.createOrderPiece(orderPieceData);
            }
        }

        res.status(200).send('Seeded order pieces successfully!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to seed order pieces.');
    }
});



router.post('/create', async (req, res) => {
    try {
        const orderPieceData = req.body;
        const orderPiece = await orderPieceRepository.createOrderPiece(orderPieceData);
        res.status(201).json(orderPiece);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to create order piece.');
    }
});

router.get('/all', async (req, res) => {
    try {
        const orderPieces = await orderPieceRepository.getAllOrderPieces();
        res.status(200).json(orderPieces);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to get order pieces.');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const orderPiece = await orderPieceRepository.getOrderPieceById(id);
        if (!orderPiece) {
            res.status(404).send('Order piece not found.');
        } else {
            res.status(200).json(orderPiece);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to get order piece.');
    }
});

router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedOrderPiece = await orderPieceRepository.updateOrderPiece(id, updateData);
        res.status(200).json(updatedOrderPiece);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to update order piece.');
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await orderPieceRepository.deleteOrderPiece(id);
        res.status(200).send('Order piece deleted successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to delete order piece.');
    }
});

exports.initializeRoutes = () => router;

