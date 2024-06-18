const { Machine } = require('../../models/workshop/machines');

exports.createMachine = async (machineData) => {
    try {
        return await Machine.create(machineData);
    } catch (error) {
        throw error;
    }
};

exports.getAllMachines = async () => {
    try {
        return await Machine.findAll();
    } catch (error) {
        throw error;
    }
};

exports.getMachineById = async (id) => {
    try {
        return await Machine.findByPk(id);
    } catch (error) {
        throw error;
    }
};

