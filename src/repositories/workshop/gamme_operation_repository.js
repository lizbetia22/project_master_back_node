const {Gamme_operation} = require("../../models/workshop/gamme_operation");
const {sequelize} = require("../../models/database");
const {Gamme} = require("../../models/workshop/gamme");

exports.createGammeOperation = async (gammeOperationData) => {
    try {
        return await Gamme_operation.create(gammeOperationData);
    } catch (error) {
        throw error;
    }
};

exports.getAllGammeOperations = async () => {
    try {
        return await Gamme_operation.findAll(
            {
                order: [['id', 'ASC']]
            }
        );
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
//Oprimized requst usinhg sql native
exports.findByGammeId = async (id_gamme) => {
    try {
        const query = `
            SELECT
                go.id,
                go.id_operation,
                go.id_gamme,
                go.time,
                o.name AS operation_name,
                o.time AS operation_time,
                m.name AS machine_name,
                p.name AS post_name
            FROM
                gamme_operation go
                JOIN 
                    operation o ON go.id_operation = o.id
                JOIN
                    machine m ON o.id_machine = m.id
                JOIN
                    post p ON o.id_post = p.id
            WHERE
                go.id_gamme = :id_gamme;
        `;

        const results = await sequelize.query(query, {
            replacements: { id_gamme: id_gamme },
            type: sequelize.QueryTypes.SELECT
        });
        console.log(results)

        return results;
    } catch (error) {
        throw error;
    }
};

exports.updateGammeAndOperations = async (id, gammeData, operationsData) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();

        const gamme = await Gamme.findByPk(id, { transaction });
        if (!gamme) {
            console.error(`Gamme with id ${id} not found`);
        }

        await gamme.update(gammeData, { transaction });

        // Delete existing operations
        await Gamme_operation.destroy({
            where: { id_gamme: id },
            transaction
        });

        // Create new operations
        const newOperations = await Promise.all(operationsData.map(operation =>
            Gamme_operation.create({
                id_gamme: id,
                id_operation: operation.id_operation,
                time: operation.time
            }, { transaction })
        ));

        await transaction.commit();
        return { gamme, operations: newOperations };
    } catch (error) {
        if (transaction) await transaction.rollback();
        throw error;
    }
};



