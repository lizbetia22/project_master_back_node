const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const companyOrderPieceRepository = require('../../repositories/commerce/company_order_piece_repository');

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

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const companyOrderPieceData = req.body;
    try {
        const updatedCompanyOrderPiece = await companyOrderPieceRepository.updateCompanyOrderPiece(id, companyOrderPieceData);
        res.status(200).json(updatedCompanyOrderPiece);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to update company order piece.');
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCompanyOrderPiece = await companyOrderPieceRepository.deleteCompanyOrderPiece(id);
        res.status(200).json(deletedCompanyOrderPiece);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to delete company order piece.');
    }
});


exports.initializeRoutes = () => router;

