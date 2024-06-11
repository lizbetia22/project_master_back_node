const {DataTypes } = require('sequelize');
const {sequelize} = require('../database');

exports.Devis = sequelize.define('Devis', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_user: {
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
        allowNull: false,
    },
}, {
    tableName: 'devis',
    timestamps: false,
});