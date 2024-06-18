const express = require('express');
const machineRepository = require('../../repositories/workshop/machine_repository');
const router = express.Router();

router.post('/seeder', async (req, res) => {
    const machines = [
        { name: 'Lathe Machine'},
        { name: 'Milling Machine' },
        { name: 'Drill Press' },
        { name: 'Welding Machine' },
        { name: 'Table Saw' },
        { name: 'Band Saw' },
        { name: 'Planer' },
        { name: 'Router' },
        { name: 'Wood Lathe' },
        { name: 'Sewing Machine' },
        { name: 'Overlock Machine' },
        { name: 'Embroidery Machine' },
        { name: 'Knitting Machine' },
        { name: 'Cutting Machine' }
    ];

    try {
        for (const machine of machines) {
            await machineRepository.createMachine(machine);
        }
        res.status(200).send('Seeded machines successfully!');
    } catch (err) {
        console.log(err);
        res.status(500).send('Failed to seed machines.');
    }
});
router.get('/all', async (req, res) => {
    try {
        const machines = await machineRepository.getAllMachines();
        res.json(machines);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const machine = await machineRepository.getMachineById(req.params.id);
        if (machine) {
            res.json(machine);
        } else {
            res.status(404).json({ error: 'Machine not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/create', async (req, res) => {
    try {
        const machine = await machineRepository.createMachine(req.body);
        res.status(201).json(machine);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



exports.initializeRoutes = () => router;
