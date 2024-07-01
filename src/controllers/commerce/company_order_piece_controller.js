const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const companyOrderPieceRepository = require('../../repositories/commerce/company_order_piece_repository');
const {createCompanyOrder} = require("../../repositories/commerce/company_order_repository");
const {Company_order} = require("../../models/commerce/company_order");
const {Devis_piece} = require("../../models/commerce/devis_piece");
const {Company_order_piece} = require("../../models/commerce/company_order_piece");
const {sequelize} = require("../../models/database");

router.post('/seeder', async (req, res) => {
    const companyOrderPiecesData = [
        {
            id_piece: [2, 3, 1],
            id_order: 1,
            price: [100, 200, 300],
            quantity: [5, 7, 10],
        },
        {
            id_piece: [2],
            id_order: 2,
            price: [250],
            quantity: [20],
        },
        {
            id_piece: [4, 5],
            id_order: 3,
            price: [25, 78],
            quantity: [120, 10],
        },
        {
            id_piece: [3, 5],
            id_order: 4,
            price: [5, 6],
            quantity: [20, 30],
        },
        {
            id_piece: [6, 2],
            id_order: 5,
            price: [18, 33],
            quantity: [50, 80],
        },
    ];

    try {
        for (const companyOrderPiece of companyOrderPiecesData) {
            await companyOrderPieceRepository.createCompanyOrderPiece(companyOrderPiece);
        }
        res.status(200).send('Seeded company order pieces successfully!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to seed company order pieces.');
    }
});


router.post('/create', async (req, res) => {
    try {
        const companyOrderPieceData = req.body;
        const newCompanyOrderPiece = await companyOrderPieceRepository.createCompanyOrderPiece(companyOrderPieceData);
        res.status(201).json(newCompanyOrderPiece);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to create company order piece.');
    }
});

router.get('/all', async (req, res) => {
    try {
        const companyOrderPieces = await companyOrderPieceRepository.getAllCompanyOrderPieces();
        res.status(200).json(companyOrderPieces);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to fetch company order pieces.');
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const companyOrderPiece = await companyOrderPieceRepository.getCompanyOrderPieceById(id);
        if (!companyOrderPiece) {
            res.status(404).send('Company order piece not found.');
        } else {
            res.status(200).json(companyOrderPiece);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to fetch company order piece.');
    }
});

router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { id_supplier, date, planned_delivery_date, actual_delivery_date, pieces } = req.body;

    const transaction = await sequelize.transaction();

    try {
        const order = await Company_order.findOne({ where: { id }, transaction });
        if (!order) {
            console.log('Order company not found.');
            await transaction.rollback();
            return res.status(404).send('Order company not found.');
        }

        await order.update({ id_supplier, date, planned_delivery_date, actual_delivery_date }, { transaction });

        await Company_order_piece.destroy({ where: { id_order: id }, transaction });

        const promises = pieces.map(async (piece) => {
            const { id_piece, quantity, price } = piece;
            return Company_order_piece.create({ id_order: id, id_piece, quantity, price }, { transaction });
        });

        await Promise.all(promises);

        await transaction.commit();

        res.status(200).json({ message: 'Order_company and Order_company_piece updated successfully.' });
    } catch (error) {
        console.error('Error updating company order piece:', error);
        await transaction.rollback();
        res.status(500).send('Failed to update company order piece.');
    }
});


router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        await Company_order_piece.destroy({ where: { id_order: id }, transaction });
        const deletedCompanyOrder = await Company_order.destroy({ where: { id }, transaction });

        await transaction.commit();

        if (!deletedCompanyOrder) {
            return res.status(404).send('Company order not found.');
        }

        res.status(200).json({ message: 'Company order and associated pieces deleted successfully.' });
    } catch (error) {
        console.error('Error deleting company order:', error);
        await transaction.rollback();
        res.status(500).send('Failed to delete company order and associated pieces.');
    }
});


router.post('/create-order', async (req, res) => {
    const { id_supplier, date, planned_delivery_date, pieces } = req.body;

    try {
        if (!Array.isArray(pieces) || pieces.length === 0) {
            return res.status(400).send('Invalid pieces data.');
        }

        const newCompanyOrder = await createCompanyOrder({
            id_supplier,
            date,
            planned_delivery_date
        });

        const companyOrderPieces = pieces.map(piece => ({
            id_piece: piece.id_piece,
            id_order: newCompanyOrder.id,
            price: piece.price,
            quantity: piece.quantity
        }));

        const newCompanyOrderPieces = await Promise.all(
            companyOrderPieces.map(pieceData => companyOrderPieceRepository.createCompanyOrderPiece(pieceData))
        );

        res.status(201).json({
            company_order: newCompanyOrder,
            company_order_pieces: newCompanyOrderPieces
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to create company order and/or company order pieces.');
    }
});


exports.initializeRoutes = () => router;

