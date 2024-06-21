const express = require('express');
const machineRepository = require('../../repositories/workshop/machine_repository');
const router = express.Router();

router.post('/seeder', async (req, res) => {
    const machines = [
        { id_post:1, name: 'Lathe Machine'},
        { id_post:2, name: 'Milling Machine' },
        { id_post:3, name: 'Drill Press' },
        { id_post:4, name: 'Welding Machine' },
        { id_post:5, name: 'Table Saw' },
        { id_post:6, name: 'Band Saw' },
        { id_post:7, name: 'Planer' },
        { id_post:8, name: 'Router' }
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

router.put('/update/:id', async (req, res) => {
    try {
        const machine = await machineRepository.updateMachine(req.params.id, req.body);
        res.status(200).json(machine);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const result = await machineRepository.deleteMachine(req.params.id);
        if (result) {
            res.status(200).send('Machine deleted successfully');
        } else {
            res.status(404).json({ error: 'Machine not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



exports.initializeRoutes = () => router;
