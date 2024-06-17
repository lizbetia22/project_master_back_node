const express = require('express');
const router = express.Router();
const pieceRefRepository = require('../../repositories/workshop/piece_ref_repository');

router.post('/seeder', async (req, res) => {
    const piecesRef = [
        { id_piece_component: 1, id_piece_create:6, quantity: 5 },
        { id_piece_component: 1, id_piece_create:7, quantity: 20 },
        { id_piece_component: 2, id_piece_create:5, quantity: 30 },
        { id_piece_component: 2, id_piece_create:4, quantity: 40 },
        { id_piece_component: 3, id_piece_create:4, quantity: 17 },
    ];

    try {
        await Promise.all(piecesRef.map(pieceRef => pieceRefRepository.createPieceRef(pieceRef)));
        res.status(200).send('Seeded pieces ref successfully!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to seed pieces ref.');
    }
});

router.get('/all', async (req, res) => {
    try {
        const pieceRefs = await pieceRefRepository.findAllPieceRef();
        res.json(pieceRefs);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const pieceRef = await pieceRefRepository.findPieceRefById(id);
        if (pieceRef) {
            res.json(pieceRef);
        } else {
            res.status(404).json({ message: 'Piece_ref not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/components/:id_piece_create', async (req, res) => {
    try {
        const { id_piece_create } = req.params;
        const pieceRefs = await pieceRefRepository.findComponentPiecesByCreateId(id_piece_create);
        res.json(pieceRefs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/components/update/:id_piece_create', async (req, res) => {
    try {
        const { id_piece_create } = req.params;
        const components = req.body;

        const updatedComponents = await pieceRefRepository.updateComponentPiecesByCreateId(id_piece_create, components);
        res.json(updatedComponents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

exports.initializeRoutes = () => router;