const express = require('express');
const sequelize = require('./src/models/database')
const index = express();
require('dotenv').config();
const port = process.env.PORT;

sequelize
    .authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

index.get('/', (req, res) => {
    console.log("icu");
    res.send('Hello World! hh');
});

index.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
