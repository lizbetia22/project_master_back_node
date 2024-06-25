const { Supplier } = require('../../models/commerce/supplier');

exports.createSupplier = async (supplierData) => {
    try {
        return await Supplier.create(supplierData);
    } catch (error) {
        throw error;
    }
};

exports.getAllSuppliers = async () => {
    try {
        return await Supplier.findAll();
    } catch (error) {
        throw error;
    }
};

exports.getSupplierById = async (id) => {
    try {
        return await Supplier.findByPk(id);
    } catch (error) {
        throw error;
    }
};

exports.updateSupplier = async (id, supplierData) => {
    try {
        const supplier = await Supplier.findByPk(id);
        if (!supplier) {
            console.error('Supplier not found');
        }
        await supplier.update(supplierData);
        return supplier;
    } catch (error) {
        throw error;
    }
};

exports.deleteSupplier = async (id) => {
    try {
        const supplier = await Supplier.findByPk(id);
        if (!supplier) {
            console.error('Supplier not found');
        }
        await supplier.destroy();
        return supplier;
    } catch (error) {
        throw error;
    }
};
