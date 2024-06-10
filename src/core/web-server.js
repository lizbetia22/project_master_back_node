const express = require('express');
const sequelize = require('../models/database')
const dotenv = require('dotenv');


dotenv.config()
class WebServer {
    app;
    port;
    server;
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = undefined;
        this.tablesConnections();
        sequelize.sync()
            .then(() => {
                console.log('Database connected and synchronized');
            })
            .catch(err => {
                console.error('Unable to connect to the database:', err);
            });
        this.setupRoutes();
       // sequelize.sync();
        //sequelize.sync({force:true});
    }

    tablesConnections() {
        const { Piece, Piece_ref } = require('../models/workshop/');
        Piece.hasMany(Piece_ref, { foreignKey: 'id_piece' });
        Piece_ref.belongsTo(Piece, { foreignKey: 'id_piece' });
    }


    setupRoutes() {
        this.app.get('/', (req, res) => {
            res.send('Hello World!');
        });
    }

    start() {
        this.server = this.app.listen(this.port, () => {
            console.log(`Example app listening on port ${this.port}`);
        });
    }

    stop() {
        this.server.close();
    }
}

module.exports = WebServer;