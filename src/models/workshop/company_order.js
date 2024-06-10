const {DataTypes } = require('sequelize');
const {sequelize} = require('../database');

const Company_order = sequelize.define('Company_order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_supplier: {
        foreignKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    planned_delivery_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    actual_delivery_date: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    tableName: 'company_order',
    timestamps: false,
});

module.exports = Company_order;