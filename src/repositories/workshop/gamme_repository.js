const {Gamme} = require("../../models/workshop/gamme");
const {Piece} = require("../../models/workshop/piece");
const {User} = require("../../models/users/user");
const {Role} = require("../../models/users/roles");
const {Gamme_operation} = require("../../models/workshop/gamme_operation");
const {Gamme_production} = require("../../models/workshop/gamme_production");

exports.getAllGammes = async () => {
    try {
        return await Gamme.findAll({
            order: [['id', 'ASC']],
            include: [
                {
                    model: Piece,
                    attributes: ['name'],
                },
                {
                    model: User,
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: Role,
                            attributes: ['name'],
                        },
                    ],
                },
            ],
            attributes: ['id', 'name'],
        });
    } catch (error) {
        throw error;
    }
};

exports.findGammeById = async (id) => {
    try {
       return await Gamme.findByPk(id, {
            include: [
                {
                    model: User,
                    attributes: ['name'],
                },
                {
                    model: Piece,
                    attributes: ['name']
                }
            ]
        });
    } catch (error) {
        throw error;
    }
};

exports.createGamme = async (gamme) => {
    try {
        return await Gamme.create(gamme);
    } catch (error) {
        throw error;
    }
};

exports.checkGammeReferences = async (id) => {
    try {
        const operationsCount = await Gamme_operation.count({ where: { id_gamme: id } });
        const productionsCount = await Gamme_production.count({ where: { id_gamme: id } });

        return operationsCount + productionsCount;
    } catch (error) {
        throw error;
    }
};

exports.deleteGamme = async (id) => {
    try {
        const gamme = await Gamme.findByPk(id);
        if (!gamme) {
          console.error(`Gamme with id ${id} not found`);
        }
        await gamme.destroy();
        return { message: `Gamme with id ${id} successfully deleted` };
    } catch (error) {
        throw error;
    }
};