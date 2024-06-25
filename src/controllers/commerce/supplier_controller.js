const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const supplierRepository = require('../../repositories/commerce/supplier_repository');
router.post('/seeder', async (req, res) => {
    const supplierData = [
        { name: 'Supplier 1', email: 'supplier1@example.com' },
        { name: 'Supplier 2', email: 'supplier2@example.com' },
        { name: 'Supplier 3', email: 'supplier3@example.com' },
        { name: 'Supplier 4', email: 'supplier4@example.com' },
        { name: 'Supplier 5', email: 'supplier5@example.com' },
    ];

    try {
        for (const supplier of supplierData) {
            await supplierRepository.createSupplier(supplier);
        }
        res.status(200).send('Seeded suppliers successfully!');
    } catch (err) {
        console.log(err);
        res.status(500).send('Failed to seed suppliers.');
    }
});
router.post('/create', async (req, res) => {
    try {
        const supplierData = req.body;
        const newSupplier = await supplierRepository.createSupplier(supplierData);
        res.status(201).json(newSupplier);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to create supplier.');
    }
});

router.get('/all', async (req, res) => {
    try {
        const suppliers = await supplierRepository.getAllSuppliers();
        res.status(200).json(suppliers);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to fetch suppliers.');
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const supplier = await supplierRepository.getSupplierById(id);
        if (!supplier) {
            res.status(404).send('Supplier not found.');
        } else {
            res.status(200).json(supplier);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to fetch supplier.');
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const supplierData = req.body;
    try {
        const updatedSupplier = await supplierRepository.updateSupplier(id, supplierData);
        res.status(200).json(updatedSupplier);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to update supplier.');
    }
});


router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedSupplier = await supplierRepository.deleteSupplier(id);
        res.status(200).json(deletedSupplier);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to delete supplier.');
    }
});

exports.initializeRoutes = () => router;
