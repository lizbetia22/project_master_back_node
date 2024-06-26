const { Order_piece } = require('../../models/commerce/order_piece');
const { Piece } = require('../../models/workshop/piece');
const { Order } = require('../../models/commerce/order');
const {User} = require("../../models/users/user");
const PDFDocument = require("pdfkit");
const {createWriteStream} = require("fs");

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

exports.createFacturePdf = async (orderId) => {
    try {
        const orderPieces = await Order_piece.findAll({
            where: { id_order: orderId },
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

        if (!orderPieces || orderPieces.length === 0) {
            console.error('No order pieces found for order ID:', orderId);
            throw new Error('No order pieces found');
        }

        // Create a document
        const doc = new PDFDocument();
        const chunks = [];
        let result;

        // Pipe its output to an array buffer
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => {
            result = Buffer.concat(chunks);
        });

        // Iterate over each order piece and add details to the PDF
        for (let i = 0; i < orderPieces.length; i++) {
            const orderPiece = orderPieces[i];
            const dateOrder = new Date(orderPiece.Order.date_order);
            const formattedDate = dateOrder.toISOString().split('T')[0];

            doc.fontSize(16).text(`Facture - Order Piece ID: ${orderPiece.id}`, { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`Date de commande: ${formattedDate}`);
            doc.text(`Utilisateur: ${orderPiece.Order.User.name}`);
            doc.moveDown();

            doc.text('Piece:');
            doc.text(`  - ${orderPiece.Piece.name}`);
            doc.moveDown();

            doc.text('Quantities:');
            doc.text(`  - ${orderPiece.quantity}`);
            doc.moveDown();

            doc.text('Prices:');
            doc.text(`  - ${orderPiece.price}`);
            doc.moveDown();

            // Add some space between different order pieces
            if (i < orderPieces.length - 1) {
                doc.addPage(); // Add a new page for each order piece except the last one
            }
        }

        // Finalize PDF file
        doc.end();

        // Wait for the PDF to be fully generated
        await new Promise((resolve) => doc.on('end', resolve));

        return result;
    } catch (error) {
        throw error;
    }
};