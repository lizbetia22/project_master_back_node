const { Machine } = require('../../models/workshop/machines');
const {Post} = require("../../models/users/post");
const {Operation} = require("../../models/workshop/operation");

exports.createMachine = async (machineData) => {
    try {
        return await Machine.create(machineData);
    } catch (error) {
        throw error;
    }
};

exports.getAllMachines = async () => {
    try {
        return await Machine.findAll({
            order: [['id', 'ASC']],
            include: [{
                model: Post,
                attributes: ['id','name']
            },
                {
                    model: Operation,
                    attributes: ['id']
                }
            ]
        });
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
exports.updateMachine = async (id, updateData) => {
    try {
        const [updated] = await Machine.update(updateData, {
            where: { id: id }
        });
        if (updated) {
            return await Machine.findByPk(id);
        }
        console.error('Machine not found');
    } catch (error) {
        throw error;
    }
};

exports.deleteMachine = async (id) => {
    try {
        const deleted = await Machine.destroy({
            where: { id: id }
        });
        if (deleted) {
            return true;
        }
        console.error('Machine not found');
    } catch (error) {
        throw error;
    }
};

