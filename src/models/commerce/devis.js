const {DataTypes } = require('sequelize');
const {sequelize} = require('../database');

exports.Devis = sequelize.define('Devis', {
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
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'devis',
    timestamps: false,
});