const { Devis } = require('../../models/commerce/devis');

exports.createDevis = async (devisData) => {
    try {
        return await Devis.create(devisData);
    } catch (error) {
        throw error;
    }
};

exports.getAllDevis = async () => {
    try {
        return await Devis.findAll({ order: [['id', 'ASC']] });
    } catch (error) {
        throw error;
    }
};

exports.getDevisById = async (id) => {
    try {
        return await Devis.findOne({ where: { id } });
    } catch (error) {
        throw error;
    }
};

exports.updateDevis = async (id, updateData) => {
    try {
        const devis = await Devis.findOne({ where: { id } });
        if (!devis) throw new Error('Devis not found');
        return await devis.update(updateData);
    } catch (error) {
        throw error;
    }
};

exports.deleteDevis = async (id) => {
    try {
        const devis = await Devis.findOne({ where: { id } });
        if (!devis) throw new Error('Devis not found');
        return await devis.destroy();
    } catch (error) {
        throw error;
    }
};
