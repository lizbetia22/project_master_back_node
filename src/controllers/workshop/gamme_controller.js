const express = require('express');
const router = express.Router();
const gammeRepository = require('../../repositories/workshop/gamme_repository');

router.post('/seeder', async (req, res) => {
    const gammes = [
        { id_piece: 1, id_user: 5, name: "Gamme de fabrication C" },
        { id_piece: 2, id_user: 6, name: "Gamme de fabrication A" },
        { id_piece: 3, id_user: 7, name: "Gamme de fabrication B" },
        { id_piece: 4, id_user: 8, name: "Gamme de fabrication D" },
        { id_piece: 5, id_user: 5, name: "Gamme de fabrication E" },
        { id_piece: 5, id_user: 6, name: "Gamme de fabrication F" },
    ];

    try {
        await Promise.all(gammes.map(gamme => gammeRepository.createGamme(gamme)));
        res.status(200).send('Seeded gammes successfully!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to seed gammes.');
    }
});

router.post('/create', async (req, res) => {
    try {
        const { id_piece, id_user, name } = req.body;
        if (!id_piece || !id_user || !name) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const gamme = await gammeRepository.createGamme({ id_piece, id_user, name });
        res.status(201).json(gamme);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/all', async (req, res) => {
    try {
        const gammes = await gammeRepository.getAllGammes();
        res.status(200).json(gammes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const gamme = await gammeRepository.findGammeById(req.params.id);
        if (gamme) {
            res.status(200).json(gamme);
        } else {
            res.status(404).json({ message: 'Gamme not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


exports.initializeRoutes = () => router;
