const express = require('express');
const router = express.Router();
const pieceRepository = require('../../repositories/workshop/piece_repository');
const pieceRefRepository = require('../../repositories/workshop/piece_ref_repository');

router.post('/seeder', async (req, res) => {
    const pieces = [
        { name: 'Pneu 205P', type: 'Matière première', price: 89.00 },
        { name: 'Caoutchouc T85', type: 'Pièces livrables aux clients', price: 150.00 },
        { name: 'Métal YU5', type: 'Pièce achetée', price: 200.00 },
        { name: 'Bois X8', type: 'Pièce intermédiaire', price: 64.00 },
        { name: 'Chase GT7', type: 'Matière première', price: 37.00 },
        { name: 'Table GT8', type: 'Pièces livrables aux clients', price: 92.00 },
        { name: 'Fer GM1', type: 'Matière première', price: 17.00 },
        { name: 'Béton X5', type: 'Pièce intermédiaire', price: 75.00 },
        { name: 'Planche 55T', type: 'Pièce achetée', price: 66.00 }
    ];

    try {
        await Promise.all(pieces.map(piece => pieceRepository.createPiece(piece)));
        res.status(200).send('Seeded pieces successfully!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to seed pieces.');
    }
});

router.post('/create', async (req, res) => {
    try {
        const { name, type, price } = req.body;
        if (!name || !type || !price) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const piece = await pieceRepository.createPiece({ name, type, price });
        res.status(201).json(piece);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/all', async (req, res) => {
    try {
        const pieces = await pieceRepository.getAllPieces();
        res.json(pieces);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const piece = await pieceRepository.findPieceById(req.params.id);
        if (piece) {
            res.json(piece);
        } else {
            res.status(404).json({ error: 'Piece not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/update/:id', async (req, res) => {
    try {
        const { name, type, price } = req.body;
        if (!name || !type || !price) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const piece = await pieceRepository.updatePiece(req.params.id, { name, type, price });
        res.status(200).json(piece);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const relatedRecords = await pieceRepository.checkPieceReferences(id);

        if (relatedRecords > 0) {
            return res.status(400).json({ message: 'Cannot delete piece because it has related records.' });
        }
        const deletedRows = await pieceRepository.deletePiece(id);

        if (deletedRows) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Piece not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.put('/update/ref/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { piece, components } = req.body;

        if (!piece && !components) {
            return res.status(400).json({ message: 'Body is required' });
        }

        const updatedPiece = await pieceRepository.updatePiece(id, piece);

        let updatedComponents;
        if (components) {
            updatedComponents = await pieceRefRepository.updateComponentPiecesByCreateId(id, components);
        }

        return res.status(200).json({ piece: updatedPiece, components: updatedComponents });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/create/ref', async (req, res) => {
    try {
        const { piece, components } = req.body;

        if (!piece) {
            return res.status(400).json({ message: 'Piece data is required' });
        }

        const createdPiece = await pieceRepository.createPiece(piece);

        let createdComponents;
        if (components && Array.isArray(components)) {
            createdComponents = await Promise.all(components.map(async (component) => {
                return await pieceRefRepository.createPieceRef({
                    id_piece_create: createdPiece.id,
                    ...component
                });
            }));
        }

        return res.status(201).json({ piece: createdPiece, components: createdComponents });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




exports.initializeRoutes = () => router;