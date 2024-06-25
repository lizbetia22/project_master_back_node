const { Order } = require('../../models/commerce/order');
const { Devis } = require('../../models/commerce/devis');
const { User } = require('../../models/users/user');

exports.createOrder = async (orderData) => {
    try {
        return await Order.create(orderData);
    } catch (error) {
        throw error;
    }
};

exports.getAllOrders = async () => {
    try {
        return await Order.findAll({
            order: [['id', 'ASC']],
            include: [
                {
                    model: Devis,
                    attributes: ['id_user', 'date', 'deadline'],
                    include: [
                        {
                            model: User,
                            attributes: ['name'],
                        },
                    ],
                },
                {
                    model: User,
                    attributes: ['name'],
                },
            ],
        });
    } catch (error) {
        throw error;
    }
};

exports.getOrderById = async (id) => {
    try {
        return await Order.findOne({
            where: { id },
            include: [
                {
                    model: Devis,
                    attributes: ['id_user', 'date', 'deadline'],
                    include: [
                        {
                            model: User,
                            attributes: ['name'],
                        },
                    ],
                },
                {
                    model: User,
                    attributes: ['name'],
                },
            ],
        });
    } catch (error) {
        throw error;
    }
};

exports.updateOrder = async (id, updateData) => {
    try {
        const order = await Order.findOne({ where: { id } });
        if (!order) console.error('Order not found');
        return await order.update(updateData);
    } catch (error) {
        throw error;
    }
};

exports.deleteOrder = async (id) => {
    try {
        const order = await Order.findOne({ where: { id } });
        if (!order) console.error('Order not found');
        return await order.destroy();
    } catch (error) {
        throw error;
    }
};
