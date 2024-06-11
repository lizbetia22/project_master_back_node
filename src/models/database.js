const { Sequelize } = require('sequelize');
require('dotenv').config();

// const sequelize = new Sequelize(
//     process.env.DATABASE_NAME,
//     process.env.APP_DB,
//     process.env.PASSWORD_DB,
//     {
//         host: process.env.HOST,
//         dialect: process.env.DIALECT,
//     }
// );
//
// module.exports = sequelize;

exports.sequelize = new Sequelize(process.env.DATABASE_NAME,process.env.APP_DB, process.env.PASSWORD_DB,{
    host: process.env.HOST,
    dialect: process.env.DIALECT,
});