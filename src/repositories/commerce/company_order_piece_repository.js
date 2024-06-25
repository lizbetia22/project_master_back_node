const { Company_order_piece } = require('../../models/commerce/company_order_piece');
const {Piece} = require("../../models/workshop/piece");
const {Company_order} = require("../../models/commerce/company_order");
const {User} = require("../../models/users/user");
const {Supplier} = require("../../models/commerce/supplier");

// exports.createCompanyOrderPiece = async (companyOrderPieceData) => {
//     try {
//         return await Company_order_piece.create(companyOrderPieceData);
//     } catch (error) {
//         throw error;
//     }
// };

exports.createCompanyOrderPiece = async (companyOrderPieceData) => {
    try {
        const { id_piece, ...restData } = companyOrderPieceData;

        if (Array.isArray(id_piece)) {
            const promises = id_piece.map(async (pieceId, index) => {
                const data = {
                    id_piece: pieceId,
                    id_order: restData.id_order,
                    price: restData.price[index],
                    quantity: restData.quantity[index],
                };
                return Company_order_piece.create(data);
            });
            return await Promise.all(promises);
        } else {
            return await Company_order_piece.create(companyOrderPieceData);
        }
    } catch (error) {
        throw error;
    }
};


exports.getAllCompanyOrderPieces = async () => {
    try {
        return await Company_order_piece.findAll({
            include: [
                {
                    model: Company_order,
                    attributes: ['id_supplier', 'date', 'planned_delivery_date', 'actual_delivery_date'],
                    include: [
                        {
                            model: Supplier,
                            attributes: ['name'],
                        },
                        ]
                },
                {
                    model: Piece,
                    attributes: ['name']
                }
                ]
        });
    } catch (error) {
        throw error;
    }
};

exports.getCompanyOrderPieceById = async (id) => {
    try {
        return await Company_order_piece.findByPk(id);
    } catch (error) {
        throw error;
    }
};

exports.updateCompanyOrderPiece = async (id, companyOrderPieceData) => {
    try {
        const companyOrderPiece = await Company_order_piece.findByPk(id);
        if (!companyOrderPiece) {
           console.error('Company order piece not found');
        }
        await companyOrderPiece.update(companyOrderPieceData);
        return companyOrderPiece;
    } catch (error) {
        throw error;
    }
};

exports.deleteCompanyOrderPiece = async (id) => {
    try {
        const companyOrderPiece = await Company_order_piece.findByPk(id);
        if (!companyOrderPiece) {
           console.error('Company order piece not found');
        }
        await companyOrderPiece.destroy();
        return companyOrderPiece;
    } catch (error) {
        throw error;
    }
};
