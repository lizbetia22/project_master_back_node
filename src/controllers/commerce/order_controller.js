const express = require('express');
const router = express.Router();
const orderRepository = require('../../repositories/commerce/order_repository');

router.post('/seeder', async (req, res) => {
    const ordersData = [
        {
            id_client: 1,
            id_devis: 1,
            date_order: new Date(),
        },
        {
            id_client: 2,
            id_devis: 2,
            date_order: new Date(),
        },
        {
            id_client: 3,
            id_devis: 3,
            date_order: new Date(),
        },
        {
            id_client: 4,
            id_devis: 4,
            date_order: new Date(),
        },
        {
            id_client: 5,
            id_devis: 5,
            date_order: new Date(),
        },
    ];

    try {
        for (const order of ordersData) {
            await orderRepository.createOrder(order);
        }
        res.status(200).send('Seeded orders successfully!');
    } catch (err) {
        console.log(err);
        res.status(500).send('Failed to seed orders.');
    }
});

router.post('/create', async (req, res) => {
    try {
        const orderData = req.body;
        const order = await orderRepository.createOrder(orderData);
        res.status(201).json(order);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to create order.');
    }
});

router.get('/all', async (req, res) => {
    try {
        const orders = await orderRepository.getAllOrders();
        res.status(200).json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to get orders.');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const order = await orderRepository.getOrderById(id);
        if (!order) {
            res.status(404).send('Order not found.');
        } else {
            res.status(200).json(order);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to get order.');
    }
});

router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedOrder = await orderRepository.updateOrder(id, updateData);
        res.status(200).json(updatedOrder);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to update order.');
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await orderRepository.deleteOrder(id);
        res.status(200).send('Order deleted successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to delete order.');
    }
});

exports.initializeRoutes = () => router;
