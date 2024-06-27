const { Client_commerce } = require('../../models/commerce/client');

exports.createClient = async (clientData) => {
    try {
        return await Client_commerce.create(clientData);
    } catch (error) {
        throw error;
    }
};

exports.getAllClients = async () => {
    try {
        return await Client_commerce.findAll({
            order: [['id', 'ASC']],
        });
    } catch (error) {
        throw error;
    }
};

exports.getClientById = async (id) => {
    try {
        return await Client_commerce.findByPk(id);
    } catch (error) {
        throw error;
    }
};
