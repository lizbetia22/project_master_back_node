const { Order_piece } = require('../../models/commerce/order_piece');
const { Piece } = require('../../models/workshop/piece');
const { Order } = require('../../models/commerce/order');
const {User} = require("../../models/users/user");

exports.createOrderPiece = async (orderPieceData) => {
    try {
        return await Order_piece.create(orderPieceData);
    } catch (error) {
        throw error;
    }
};

exports.getAllOrderPieces = async () => {
    try {
        return await Order_piece.findAll({
            order: [['id', 'ASC']],
            include: [
                {
                    model: Piece,
                    attributes: ['name'],
                },
                {
                    model: Order,
                    attributes: ['id_user', 'date_order'],
                    include: [
                        {
                            model: User,
                            attributes: ['name'],
                        },
                    ],
                },
            ],
        });
    } catch (error) {
        throw error;
    }
};

exports.getOrderPieceById = async (id) => {
    try {
        return await Order_piece.findOne({
            where: { id },
            include: [
                {
                    model: Piece,
                    attributes: ['name'],
                },
                {
                    model: Order,
                    attributes: ['id_user', 'date_order'],
                    include: [
                        {
                            model: User,
                            attributes: ['name'],
                        },
                    ],
                }
            ],
        });
    } catch (error) {
        throw error;
    }
};

exports.updateOrderPiece = async (id, updateData) => {
    try {
        const orderPiece = await Order_piece.findOne({ where: { id } });
        if (!orderPiece) console.error('Order piece not found');
        return await orderPiece.update(updateData);
    } catch (error) {
        throw error;
    }
};

exports.deleteOrderPiece = async (id) => {
    try {
        const orderPiece = await Order_piece.findOne({ where: { id } });
        if (!orderPiece)console.error('Order piece not found');
        return await orderPiece.destroy();
    } catch (error) {
        throw error;
    }
};
