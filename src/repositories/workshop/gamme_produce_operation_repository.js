const {Gamme_produce_operation} = require("../../models/workshop/gamme_produce_operation");
const {Post} = require("../../models/users/post");
const {Machine} = require("../../models/workshop/machines");
const {Gamme_operation} = require("../../models/workshop/gamme_operation");
const {Gamme} = require("../../models/workshop/gamme");
const {User} = require("../../models/users/user");
exports.createGammProduceOperation = async (gammeProduceOperationData) => {
    try {
        return await Gamme_produce_operation.create(gammeProduceOperationData);
    } catch (error) {
        throw error;
    }
};

exports.getAllGammeProduceOperations = async () => {
    try {
        return await Gamme_produce_operation.findAll({
            include: [
                {
                    model: Gamme_operation,
                    attributes: ['id_gamme'],
                    include: [
                        {
                            model: Gamme,
                            attributes: ['name'],
                            include: [
                                { model: User, attributes: ['name'] }
                            ]
                        }
                    ]
                },
                { model: Post, attributes: ['name'] },
                { model: Machine, attributes: ['name'] }
            ]
        });
    } catch (error) {
        throw error;
    }
};

exports.getGammeProduceOperationById = async (id) => {
    try {
        return await Gamme_produce_operation.findByPk(id);
    } catch (error) {
        throw error;
    }
};

exports.updateGammeProduceOperation = async (id, updatedData) => {
    try {
        const gammeProduceOperation = await Gamme_produce_operation.findByPk(id);
        if (!gammeProduceOperation) {
            console.error(`GammeProduceOperation with id ${id} not found`);
        }
        return await gammeProduceOperation.update(updatedData);
    } catch (error) {
        throw error;
    }
};

exports.deleteGammeProduceOperation = async (id) => {
    try {
        const gammeProduceOperation = await Gamme_produce_operation.findByPk(id);
        if (!gammeProduceOperation) {
            console.error(`GammeProduceOperation with id ${id} not found`);
        }
        await gammeProduceOperation.destroy();
        return { message: `GammeProduceOperation with id ${id} successfully deleted` };
    } catch (error) {
        throw error;
    }
};

