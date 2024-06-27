const {DataTypes } = require('sequelize');
const {sequelize} = require('../database');

exports.Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_client: {
        foreignKey:true,
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_devis: {
        foreignKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    date_order: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'order',
    timestamps: false,
});