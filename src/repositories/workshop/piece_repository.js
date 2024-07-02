const {Piece} = require("../../models/workshop/piece");
const {Piece_ref} = require("../../models/workshop/pieces_ref");
const {Devis_piece} = require("../../models/commerce/devis_piece");
const {Order_piece} = require("../../models/commerce/order_piece");
const {Company_order_piece} = require("../../models/commerce/company_order_piece");
const {Gamme} = require("../../models/workshop/gamme");

exports.getAllPieces = async () => {
    try {
        return await Piece.findAll({
            order: [['id', 'ASC']]
        });
    } catch (error) {
        throw error;
    }
};

exports.findPieceById = async (id) => {
    try {
        return await Piece.findByPk(id);
    } catch (error) {
        throw error;
    }
};


exports.createPiece = async (piece) => {
    try {
        return await Piece.create(piece);
    } catch (error) {
        throw error;
    }
};

exports.updatePiece = async (id, piece) => {
    try {
        const [updatedRows] = await Piece.update(piece, {
            where: { id }
        });
        if (updatedRows === 0) {
            console.error('Piece not found');
        }
        return this.findPieceById(id);
    } catch (error) {
        throw error;
    }
};

exports.checkPieceReferences = async (id) => {
    try {
        const pieceRefs = await Piece_ref.count({ where: { id_piece_component: id } });
        const createdPieceRefs = await Piece_ref.count({ where: { id_piece_create: id } });
        const devisPieces = await Devis_piece.count({ where: { id_piece: id } });
        const orderPieces = await Order_piece.count({ where: { id_piece: id } });
        const companyOrderPieces = await Company_order_piece.count({ where: { id_piece: id } });
        const gammes = await Gamme.count({ where: { id_piece: id } });
        return pieceRefs + createdPieceRefs + devisPieces + orderPieces + companyOrderPieces + gammes;
    } catch (error) {
        throw error;
    }
};

exports.deletePiece = async (id) => {
    try {
        return await Piece.destroy({
            where: {id}
        });
    } catch (error) {
        throw error;
    }
};