const {Piece} = require("../../models/workshop/piece");

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

exports.deletePiece = async (id) => {
    try {
        const deletedRows = await Piece.destroy({
            where: { id }
        });
        if (deletedRows === 0) {
            console.error('Piece not found');
        }
        return deletedRows;
    } catch (error) {
        throw error;
    }
};