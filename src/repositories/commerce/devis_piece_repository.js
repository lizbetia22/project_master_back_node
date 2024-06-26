const { Devis_piece } = require('../../models/commerce/devis_piece');
const {Role} = require("../../models/users/roles");
const {Piece} = require("../../models/workshop/piece");
const {Devis} = require("../../models/commerce/devis");
const {User} = require("../../models/users/user");

exports.createDevisPiece = async (devisPieceData) => {
    try {
        return await Devis_piece.create(devisPieceData);
    } catch (error) {
        throw error;
    }
};

exports.getAllDevisPieces = async () => {
    try {
        return await Devis_piece.findAll({
            order: [['id', 'ASC']] ,
            include: [
                {
                model: Piece,
                attributes: ['name']
            },
                {
                    model: Devis,
                    attributes: ['id_user', 'date', 'deadline'],
                    include: [
                        {
                            model: User,
                            attributes: ['id','name'],
                        }
                    ]
                }
            ]
        });
    } catch (error) {
        throw error;
    }
};

exports.getDevisPieceById = async (id) => {
    try {
        return await Devis_piece.findOne({ where: { id } });
    } catch (error) {
        throw error;
    }
};

exports.updateDevisPiece = async (id, updateData) => {
    try {
        const devisPiece = await Devis_piece.findOne({ where: { id } });
        if (!devisPiece) console.error('Devis piece not found');
        return await devisPiece.update(updateData);
    } catch (error) {
        throw error;
    }
};

exports.deleteDevisPiece = async (id) => {
    try {
        const devisPiece = await Devis_piece.findOne({ where: { id } });
        if (!devisPiece) console.error('Devis piece not found');
        return await devisPiece.destroy();
    } catch (error) {
        throw error;
    }
};
