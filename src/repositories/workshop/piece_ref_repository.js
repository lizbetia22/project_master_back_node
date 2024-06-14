const {Piece_ref } = require("../../models/workshop/pieces_ref");
const {Piece} = require("../../models/workshop/piece");

exports.createPieceRef = async (pieceRefData) => {
    try {
        return await Piece_ref.create(pieceRefData);
    } catch (error) {
        throw error;
    }
};

exports.findPieceRefById = async (id) => {
    try {
        return await Piece_ref.findByPk(id);
    } catch (error) {
        throw error;
    }
};

exports.findAllPieceRef = async () => {
    try {
        return await Piece_ref.findAll();
    } catch (error) {
        throw error;
    }
};

exports.findComponentPiecesByCreateId = async (id_piece_create) => {
    try {
        return await Piece_ref.findAll({
            where: { id_piece_create },
            include: [{ model: Piece, attributes: ['name'] }]
        });
    } catch (error) {
        throw error;
    }
};