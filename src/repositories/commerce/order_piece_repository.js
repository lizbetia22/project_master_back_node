const { Order_piece } = require('../../models/commerce/order_piece');
const { Piece } = require('../../models/workshop/piece');
const { Order } = require('../../models/commerce/order');
const {User} = require("../../models/users/user");
const PDFDocument = require("pdfkit");
const {createWriteStream} = require("fs");
const PDFTable = require('pdfkit-table');

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
        }

        const doc = new PDFDocument();
        const chunks = [];
        let result;

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => {
            result = Buffer.concat(chunks);
        });

        doc.fontSize(16).text(`Facture - N°${orderId}`, { align: 'center' });
        doc.moveDown();
        doc.font('Helvetica-Bold').fontSize(12).text(`Date de commande: ${new Date(orderPieces[0].Order.date_order).toISOString().split('T')[0]}`);
        doc.text(`Utilisateur: ${orderPieces[0].Order.User.name}`);
        doc.moveDown();

        const tableTop = 150;
        const itemCodeX = 50;
        const descriptionX = 150;
        const quantityX = 280;
        const priceX = 370;
        const rowHeight = 20;

        doc.fontSize(10)
            .text('', itemCodeX, tableTop)
            .text('Pièce', descriptionX, tableTop)
            .text('Quantité', quantityX, tableTop)
            .text('Prix', priceX, tableTop);

        doc.moveTo(50, tableTop + 15)
            .lineTo(450, tableTop + 15)
            .stroke();

        let totalSum = 0;
        let rowIndex = 1;
        orderPieces.forEach((orderPiece, index) => {
            const price = parseFloat(orderPiece.price); // Ensure price is a number
            if (isNaN(price)) {
                console.error(`Invalid price value for order piece ID: ${orderPiece.id}`);
                throw new Error('Invalid price value');
            }

            const y = tableTop + 15 + (rowIndex * rowHeight);

            doc.fontSize(10)
                .text(index + 1, itemCodeX, y)
                .text(orderPiece.Piece.name, descriptionX, y)
                .text(orderPiece.quantity, quantityX, y)
                .text(price.toFixed(2), priceX, y);

            doc.moveTo(50, y + rowHeight - 5)
                .lineTo(450, y + rowHeight - 5)
                .stroke();

            totalSum += price;
            rowIndex++;
        });

        const lineBottom = tableTop + 15 + (rowIndex * rowHeight);
        doc.moveTo(itemCodeX - 5, tableTop - 5).lineTo(itemCodeX - 5, lineBottom).stroke();
        doc.moveTo(descriptionX - 5, tableTop - 5).lineTo(descriptionX - 5, lineBottom).stroke();
        doc.moveTo(quantityX - 5, tableTop - 5).lineTo(quantityX - 5, lineBottom).stroke();
        doc.moveTo(priceX - 5, tableTop - 5).lineTo(priceX - 5, lineBottom).stroke();
        doc.moveTo(450, tableTop - 5).lineTo(450, lineBottom).stroke();

        doc.fontSize(12).text(`Total: € ${totalSum.toFixed(2)}`, { align: 'right',lineGap: 10, margins:20 });

        doc.end();

        await new Promise((resolve) => doc.on('end', resolve));

        return result;
    } catch (error) {
        throw error;
    }
};