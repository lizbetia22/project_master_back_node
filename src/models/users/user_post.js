const {DataTypes } = require('sequelize');
const {sequelize} = require('../database');

exports.User_post = sequelize.define('User_post', {
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
    id_post: {
        foreignKey:true,
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'user_post',
    timestamps: false,
});