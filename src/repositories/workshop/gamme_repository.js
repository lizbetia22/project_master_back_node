const {Gamme} = require("../../models/workshop/gamme");
const {Piece} = require("../../models/workshop/piece");
const {User} = require("../../models/users/user");
const {Role} = require("../../models/users/roles");

exports.getAllGammes = async () => {
    try {
        return await Gamme.findAll({
            order: [['id', 'ASC']],
            include: [
                { model: Piece, attributes: ['name'] },
                {
                    model: User,
                    attributes: ['name'],
                    include: [
                        { model: Role, attributes: ['name'] }
                    ]
                }
            ],
            attributes: ['id', 'name']
        });
    } catch (error) {
        throw error;
    }
};

exports.findGammeById = async (id) => {
    try {
        return await Gamme.findByPk(id);
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