const express = require('express');
const { sequelize } = require('../models/database');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { initializeConfigMiddlewares, initializeErrorMiddlwares } = require('./middlewares');

const { Piece} = require('../models/workshop/piece');
const { Piece_ref} = require('../models/workshop/pieces_ref');
const { Company_order} = require('../models/workshop/company_order');
const { Company_order_piece} = require('../models/workshop/company_order_piece');
const {Supplier } = require('../models/workshop/supplier');
const {Operation } = require('../models/workshop/operation');
const {Gamme } = require('../models/workshop/gamme');
const {Gamme_operation } = require('../models/workshop/gamme_operation');
const {Gamme_production } = require('../models/workshop/gamme_production');
const {Gamme_produce_operation } = require('../models/workshop/gamme_produce_operation');
const {Machine } = require('../models/workshop/machines');
const{Devis} = require('../models/commerce/devis');
const{Devis_piece} = require('../models/commerce/devis_piece');
const{Order} = require('../models/commerce/order');
const{Order_piece} = require('../models/commerce/order_piece');
const{Post} = require('../models/users/post');
const{Role} = require('../models/users/roles');
const{User} = require('../models/users/user');
const{User_post} = require('../models/users/user_post');

const roleRoutes = require('../controllers/users/role_controller');
const userRoutes = require('../controllers/users/user_controller');
const pieceRoutes = require('../controllers/workshop/piece_controller');
const pieceRefRoutes = require('../controllers/workshop/piece_ref_controller');
const gammeRoutes = require('../controllers/workshop/gamme_controller');
const postRoutes = require('../controllers/users/post_controller');
const machineRoutes = require('../controllers/workshop/machine_controller');
const operationRoutes = require('../controllers/workshop/operation_controller');
const gammeOperationRoutes = require('../controllers/workshop/gamme_operation_controller');
const gammeProduceOperationRoutes = require('../controllers/workshop/gamme_produce_operation_controller');
const userPostRoutes = require('../controllers/users/user_post_controller');

const cors = require("cors");

dotenv.config()
class WebServer {
    app;
    port;
    server;
    constructor() {
        this.app = express();
        this.app.use(bodyParser.json());
        const corsOptions = {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization']
        };
        this.app.use(cors(corsOptions));

        this.port = process.env.PORT;
        this.server = undefined;
        sequelize.sync()
            .then(() => {
                console.log('Database connected and synchronized');
            })
            .catch(err => {
                console.error('Unable to connect to the database:', err);
            });
        this.tablesConnections();
        this.initializeRoutes();
        initializeConfigMiddlewares(this.app);
        initializeErrorMiddlwares(this.app);
       // sequelize.sync();
       sequelize.sync({force:true});
    }

    tablesConnections() {
        // Piece
        Piece.hasMany(Piece_ref, { foreignKey: 'id_piece_component', as: 'ComponentPieces' });
        Piece_ref.belongsTo(Piece, { foreignKey: 'id_piece_component', as: 'ComponentPiece' });

        Piece.hasMany(Piece_ref, { foreignKey: 'id_piece_create', as: 'CreatedPieces' });
        Piece_ref.belongsTo(Piece, { foreignKey: 'id_piece_create', as: 'CreatedPiece' });

        Piece.hasMany(Devis_piece, { foreignKey: 'id_piece' });
        Devis_piece.belongsTo(Piece, { foreignKey: 'id_piece' });

        Piece.hasMany(Order_piece, { foreignKey: 'id_piece' });
        Order_piece.belongsTo(Piece, { foreignKey: 'id_piece' });

        Piece.hasMany(Company_order_piece, { foreignKey: 'id_piece' });
        Company_order_piece.belongsTo(Piece, { foreignKey: 'id_piece' });

        Piece.hasMany(Gamme, { foreignKey: 'id_piece' });
        Gamme.belongsTo(Piece, { foreignKey: 'id_piece' });

        // Company_order
        Company_order.belongsTo(Supplier, { foreignKey: 'id_supplier' });
        Supplier.hasMany(Company_order, { foreignKey: 'id_supplier' });

        Company_order.hasMany(Company_order_piece, { foreignKey: 'id_order' });
        Company_order_piece.belongsTo(Company_order, { foreignKey: 'id_order' });

        // Devis
        Devis.hasMany(Devis_piece, { foreignKey: 'id_devis' });
        Devis_piece.belongsTo(Devis, { foreignKey: 'id_devis' });

        Devis.hasMany(Order, { foreignKey: 'id_devis' });
        Order.belongsTo(Devis, { foreignKey: 'id_devis' });

        // Order
        Order.hasMany(Order_piece, { foreignKey: 'id_order' });
        Order_piece.belongsTo(Order, { foreignKey: 'id_order' });

        // Gamme
        Gamme.hasMany(Gamme_operation, { foreignKey: 'id_gamme' });
        Gamme_operation.belongsTo(Gamme, { foreignKey: 'id_gamme' });

        Gamme.hasMany(Gamme_production, { foreignKey: 'id_gamme' });
        Gamme_production.belongsTo(Gamme, { foreignKey: 'id_gamme' });

        Gamme_produce_operation.belongsTo(Post, { foreignKey: 'id_post' });
        Post.hasMany(Gamme_produce_operation, { foreignKey: 'id_post' });

        Gamme_produce_operation.belongsTo(Machine, { foreignKey: 'id_machine' });
        Machine.hasMany(Gamme_produce_operation, { foreignKey: 'id_machine' });

        Gamme_operation.hasMany(Gamme_produce_operation, { foreignKey: 'id_gamme_operation' });
        Gamme_produce_operation.belongsTo(Gamme_operation, { foreignKey: 'id_gamme_operation' });

        // Operation
        Operation.belongsTo(Post, { foreignKey: 'id_post' });
        Post.hasMany(Operation, { foreignKey: 'id_post' });

        Operation.belongsTo(Machine, { foreignKey: 'id_machine' });
        Machine.hasMany(Operation, { foreignKey: 'id_machine' });

        Machine.belongsTo(Post, { foreignKey: 'id_post' });
        Post.hasMany(Machine, {foreignKey: 'id_post'});

        // User
        User.belongsTo(Role, { foreignKey: 'id_role' });
        Role.hasMany(User, { foreignKey: 'id_role' });

        User.hasMany(User_post, { foreignKey: 'id_user' });
        User_post.belongsTo(User, { foreignKey: 'id_user' });

        User.hasMany(Devis, { foreignKey: 'id_user' });
        Devis.belongsTo(User, { foreignKey: 'id_user' });

        User.hasMany(Order, { foreignKey: 'id_user' });
        Order.belongsTo(User, { foreignKey: 'id_user' });

        User.hasMany(Gamme, { foreignKey: 'id_user' });
        Gamme.belongsTo(User, { foreignKey: 'id_user' });

        User_post.belongsTo(User, { foreignKey: 'id_user' });
        User_post.belongsTo(Post, { foreignKey: 'id_post' });

    }


    initializeRoutes() {
        this.app.use('/user', userRoutes.initializeRoutes());
        this.app.use('/role', roleRoutes.initializeRoutes());
        this.app.use('/piece', pieceRoutes.initializeRoutes());
        this.app.use('/piece_ref', pieceRefRoutes.initializeRoutes());
        this.app.use('/gamme', gammeRoutes.initializeRoutes());
        this.app.use('/post', postRoutes.initializeRoutes());
        this.app.use('/machine', machineRoutes.initializeRoutes());
        this.app.use('/operation', operationRoutes.initializeRoutes());
        this.app.use('/gamme-operation', gammeOperationRoutes.initializeRoutes());
        this.app.use('/gamme-produce-operation', gammeProduceOperationRoutes.initializeRoutes());
        this.app.use('/user-post', userPostRoutes.initializeRoutes());
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


//docker exec -it 9ca8b072a20b8db341ff8e290a0bfce541138b75881ce43c2f72cfe5ce24cdbe bash
//psql -U postgres -d master_project
//\d <table_name>
// r6scg3qxvlryi platform sh id

//Start server platform sh
// export SECRET_KEY="YOURSECRETKEYGOESHERE"
// export JWT_EXPIRES_IN="1h"
//
// export HOST="postgresql.internal"
// export PASSWORD_DB="main"
// export APP_DB="main"
// export DATABASE_NAME="main"
// export DIALECT="postgres"
//
// node index.js