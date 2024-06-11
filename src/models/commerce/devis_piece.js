const {DataTypes } = require('sequelize');
const {sequelize} = require('../database');

exports.Devis_piece = sequelize.define('Devis_piece', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_devis: {
        foreignKey:true,
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_piece: {
        foreignKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(15,2),
        allowNull: false,
    },
}, {
    tableName: 'devis_piece',
    timestamps: false,
});