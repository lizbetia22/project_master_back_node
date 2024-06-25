const { Company_order } = require('../../models/commerce/company_order');

exports.createCompanyOrder = async (companyOrderData) => {
    try {
        return await Company_order.create(companyOrderData);
    } catch (error) {
        throw error;
    }
};

exports.getAllCompanyOrders = async () => {
    try {
        return await Company_order.findAll();
    } catch (error) {
        throw error;
    }
};

exports.getCompanyOrderById = async (id) => {
    try {
        return await Company_order.findByPk(id);
    } catch (error) {
        throw error;
    }
};

exports.updateCompanyOrder = async (id, companyOrderData) => {
    try {
        const companyOrder = await Company_order.findByPk(id);
        if (!companyOrder) {
            console.error('Company order not found');
        }
        await companyOrder.update(companyOrderData);
        return companyOrder;
    } catch (error) {
        throw error;
    }
};

exports.deleteCompanyOrder = async (id) => {
    try {
        const companyOrder = await Company_order.findByPk(id);
        if (!companyOrder) {
            console.error('Company order not found');
        }
        await companyOrder.destroy();
        return companyOrder;
    } catch (error) {
        throw error;
    }
};
