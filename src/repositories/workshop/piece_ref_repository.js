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
            include: [
                {
                    model: Piece,
                    as: 'ComponentPiece',
                    attributes: ['name','id'],
                    foreignKey: 'id_piece_component',
                }
            ]
        });
    } catch (error) {
        throw error;
    }
};

exports.updateComponentPiecesByCreateId = async (id_piece_create, components) => {
    const transaction = await Piece_ref.sequelize.transaction();
    try {
        await Piece_ref.destroy({
            where: { id_piece_create },
            transaction,
        });

        for (const component of components) {
            await Piece_ref.create({
                id_piece_create,
                id_piece_component: component.id_piece_component,
                quantity: component.quantity,
            }, { transaction });
        }

        await transaction.commit();
        return await this.findComponentPiecesByCreateId(id_piece_create);
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};