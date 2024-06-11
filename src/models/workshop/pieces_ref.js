const {DataTypes } = require('sequelize');
const {sequelize} = require('../database');

exports.Piece_ref = sequelize.define('Piece_ref', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_piece: {
        foreignKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'pieces_ref',
    timestamps: false,
});