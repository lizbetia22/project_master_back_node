const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const companyOrderRepository = require('../../repositories/commerce/company_order_repository');

router.post('/seeder', async (req, res) => {
    const companyOrdersData = [
        {
            id_supplier: 1,
            date: new Date(),
            planned_delivery_date: new Date('2024-07-01'),
            actual_delivery_date: new Date('2024-07-02'),
        },
        {
            id_supplier: 2,
            date: new Date(),
            planned_delivery_date: new Date('2024-07-03'),
            actual_delivery_date: new Date('2024-07-04'),
        },
        {
            id_supplier: 3,
            date: new Date(),
            planned_delivery_date: new Date('2024-07-05'),
            actual_delivery_date: new Date('2024-07-06'),
        },
        {
            id_supplier: 4,
            date: new Date(),
            planned_delivery_date: new Date('2024-07-07'),
            actual_delivery_date: new Date('2024-07-08'),
        },
        {
            id_supplier: 5,
            date: new Date(),
            planned_delivery_date: new Date('2024-07-09'),
            actual_delivery_date: new Date('2024-07-10'),
        },
    ];

    try {
        for (const companyOrder of companyOrdersData) {
            await companyOrderRepository.createCompanyOrder(companyOrder);
        }
        res.status(200).send('Seeded company orders successfully!');
    } catch (err) {
        console.log(err);
        res.status(500).send('Failed to seed company orders.');
    }
});

router.post('/create', async (req, res) => {
    try {
        const companyOrderData = req.body;
        const newCompanyOrder = await companyOrderRepository.createCompanyOrder(companyOrderData);
        res.status(201).json(newCompanyOrder);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to create company order.');
    }
});

router.get('/all', async (req, res) => {
    try {
        const companyOrders = await companyOrderRepository.getAllCompanyOrders();
        res.status(200).json(companyOrders);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to fetch company orders.');
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const companyOrder = await companyOrderRepository.getCompanyOrderById(id);
        if (!companyOrder) {
            res.status(404).send('Company order not found.');
        } else {
            res.status(200).json(companyOrder);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to fetch company order.');
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const companyOrderData = req.body;
    try {
        const updatedCompanyOrder = await companyOrderRepository.updateCompanyOrder(id, companyOrderData);
        res.status(200).json(updatedCompanyOrder);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to update company order.');
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCompanyOrder = await companyOrderRepository.deleteCompanyOrder(id);
        res.status(200).json(deletedCompanyOrder);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to delete company order.');
    }
});

exports.initializeRoutes = () => router;

