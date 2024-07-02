const { Order_piece } = require('../../models/commerce/order_piece');
const { Piece } = require('../../models/workshop/piece');
const { Order } = require('../../models/commerce/order');
const {User} = require("../../models/users/user");
const PDFDocument = require("pdfkit");
const {createWriteStream} = require("fs");
const PDFTable = require('pdfkit-table');
const {Client_commerce} = require("../../models/commerce/client");

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
                    attributes: ['id_client', 'date_order'],
                    include: [
                        {
                            model: Client_commerce,
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
                    attributes: ['id_client', 'date_order'],
                    include: [
                        {
                            model: Client_commerce,
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
                    attributes: ['id_client', 'date_order'],
                    include: [
                        {
                            model: Client_commerce,
                            attributes: ['name'],
                        },
                    ],
                },
            ],
        });

        if (!orderPieces || orderPieces.length === 0) {
            console.error('No order pieces found for order ID:', orderId);
            return null; // or handle this case as needed
        }

        const doc = new PDFDocument({ margin: 50 });
        const chunks = [];
        let result;

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => {
            result = Buffer.concat(chunks);
        });

        // Title
        doc.fontSize(20).fillColor('blue').text('Facture', { align: 'center' }).moveDown();

        // Seller info
        doc.fillColor('black').font('Helvetica-Bold').fontSize(10)
            .text('Vendeur', 50, 80)
            .font('Helvetica').text('Atelier', 50, 95)
            .text('Marseille 13001', 50, 110);

        // Client info
        doc.font('Helvetica-Bold').fontSize(10)
            .text('Client', 300, 80)
            .font('Helvetica').text(orderPieces[0].Order.Client.name, 300, 95);

        // Date and Invoice number
        doc.fontSize(10).font('Helvetica-Bold')
            .text('Date de facturation', 50, 160).font('Helvetica')
            .text(new Date().toISOString().split('T')[0], 50, 175).font('Helvetica')
            .text('Numéro de facture', 200, 160)
            .text(orderId, 200, 175).font('Helvetica');

        // Additional Information
        doc.fontSize(10).font('Helvetica-Bold')
            .text('Informations additionnelles :', 50, 210).font('Helvetica')
            .text('Service Après Vente : Garantie 1 an.', 50, 225).font('Helvetica')
            .moveDown();

        // Table Headers
        const tableTop = 260;
        const itemCodeX = 50;
        const descriptionX = 150;
        const quantityX = 350;
        const priceX = 450;
        const rowHeight = 20;

        doc.fontSize(10).fillColor('white').rect(itemCodeX, tableTop, 500, rowHeight).fill('blue');

        doc.fillColor('white').fontSize(10)
            .text('Description', descriptionX, tableTop + 5)
            .text('Quantité', quantityX, tableTop + 5)
            .text('Prix unitaire HT', priceX, tableTop + 5);

        doc.moveTo(50, tableTop + rowHeight)
            .lineTo(550, tableTop + rowHeight)
            .stroke();

        let totalSum = 0;
        let rowIndex = 1;

        // Table Rows
        orderPieces.forEach((orderPiece, index) => {
            const price = parseFloat(orderPiece.price);
            if (isNaN(price)) {
                console.error(`Invalid price value for order piece ID: ${orderPiece.id}`);
                throw new Error('Invalid price value');
            }

            const quantity = parseInt(orderPiece.quantity);
            if (isNaN(quantity)) {
                console.error(`Invalid quantity value for order piece ID: ${orderPiece.id}`);
                throw new Error('Invalid quantity value');
            }

            const totalItemPrice = quantity * price;
            const y = tableTop + rowHeight + (rowIndex * rowHeight);

            if (rowIndex % 2 === 0) {
                doc.fillColor('#f0f0f0').rect(itemCodeX, y, 500, rowHeight).fill();
            } else {
                doc.fillColor('white').rect(itemCodeX, y, 500, rowHeight).fill();
            }

            doc.fillColor('black').fontSize(10)
                .text(orderPiece.Piece.name, descriptionX, y + 5)
                .text(orderPiece.quantity, quantityX, y + 5)
                .text(price.toFixed(2) + ' €', priceX, y + 5);

            doc.moveTo(50, y + rowHeight)
                .lineTo(550, y + rowHeight)
                .stroke();

            totalSum += totalItemPrice;
            rowIndex++;
        });

        const totalY = tableTop + (rowIndex * rowHeight) + 40; // Add more top margin
        doc.font('Helvetica-Bold').fontSize(12).fillColor('black')
            .text(`Total: ${totalSum.toFixed(2)} €`, 50, totalY, { align: 'right' });

        doc.end();

        await new Promise((resolve) => doc.on('end', resolve));

        return result;
    } catch (error) {
        throw error;
    }
};