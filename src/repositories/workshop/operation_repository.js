const { Operation } = require('../../models/workshop/operation');
const {Post} = require("../../models/users/post");
const {Machine} = require("../../models/workshop/machines");
const {Gamme_operation} = require("../../models/workshop/gamme_operation");

exports.createOperation = async (operationData) => {
    try {
        return await Operation.create(operationData);
    } catch (error) {
        throw error;
    }
};

exports.getAllOperations = async () => {
    try {
        return await Operation.findAll({
            order: [['id', 'ASC']],
            include: [
                {
                    model: Post,
                    attributes: ['name']
                },
                {
                    model: Machine,
                    attributes: ['name']
                }
            ]
        });
    } catch (error) {
        throw error;
    }
};


exports.getOperationById = async (id) => {
    try {
        return await Operation.findByPk(id);
    } catch (error) {
        throw error;
    }
};


exports.updateOperation = async (id, updateData) => {
    try {
        const [updated] = await Operation.update(updateData, {
            where: { id: id }
        });
        if (updated) {
            return await Operation.findByPk(id);
        }
       console.error('Operation not found');
    } catch (error) {
        throw error;
    }
};

exports.deleteOperation = async (id) => {
    try {
        const deleted = await Operation.destroy({
            where: { id: id }
        });
        if (deleted) {
            return true;
        }
       console.error('Operation not found');
    } catch (error) {
        throw error;
    }
};

