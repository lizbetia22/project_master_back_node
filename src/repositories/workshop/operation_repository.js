const { Operation } = require('../../models/workshop/operation');

exports.createOperation = async (operationData) => {
    try {
        return await Operation.create(operationData);
    } catch (error) {
        throw error;
    }
};

exports.getAllOperations = async () => {
    try {
        return await Operation.findAll();
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

