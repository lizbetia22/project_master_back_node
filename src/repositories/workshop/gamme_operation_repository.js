const {Gamme_operation} = require("../../models/workshop/gamme_operation");
exports.createGammeOperation = async (gammeOperationData) => {
    try {
        return await Gamme_operation.create(gammeOperationData);
    } catch (error) {
        throw error;
    }
};

exports.getAllGammeOperations = async () => {
    try {
        return await Gamme_operation.findAll();
    } catch (error) {
        throw error;
    }
};

exports.getGammeOperationById = async (id) => {
    try {
        return await Gamme_operation.findByPk(id);
    } catch (error) {
        throw error;
    }
};

exports.updateGammeOperation = async (id, updatedData) => {
    try {
        const gammeOperation = await Gamme_operation.findByPk(id);
        if (!gammeOperation) {
            console.error(`GammeOperation with id ${id} not found`);
        }
        return await gammeOperation.update(updatedData);
    } catch (error) {
        throw error;
    }
};

exports.deleteGammeOperation = async (id) => {
    try {
        const gammeOperation = await Gamme_operation.findByPk(id);
        if (!gammeOperation) {
          console.error(`GammeOperation with id ${id} not found`);
        }
        await gammeOperation.destroy();
        return { message: `GammeOperation with id ${id} successfully deleted` };
    } catch (error) {
        throw error;
    }
};

