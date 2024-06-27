const express = require('express');
let cors = require('cors');
let { expressjwt: jwt } = require("express-jwt");
require('dotenv').config();
const { DateTime } = require('luxon');

const middlewarePermissionsErrors = (app) => {
    app.use(function (err, req, res, next) {

    });
};

const initJsonHandlerMiddlware = (app) => app.use(express.json());
const middlewareStatic = (app) => app.use(express.static('public'));

const corsOptions = {
    origin: 'https://lizbetia22.github.io',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    header: 'X-Requested-With,content-type',
    preflightContinue: false,
    credentials: true,
    optionsSuccessStatus: 200,
};

// const middlewareCors = (app) => app.use(cors());
const middlewareCors = (app) => app.use(cors(corsOptions));

const initLoggerMiddlware = (app) => {
    app.use((req, res, next) => {
        const begin = new DateTime(new Date());

        res.on('finish', () => {
            const requestDate = begin.toString();
            const remoteIP = `IP: ${req.connection.remoteAddress}`;
            const httpInfo = `${req.method} ${req.baseUrl || req.path}`;

            const end = new DateTime(new Date());
            const requestDurationMs = end.diff(begin).toMillis();
            const requestDuration = `Duration: ${requestDurationMs}ms`;

            console.log(`[${requestDate}] - [${remoteIP}] - [${httpInfo}] - [${requestDuration}]`);
        })
        next();
    });
};

const tokenMiddlware = (app) => {
    app.use(
        jwt({
            secret: process.env.SECRET_KEY,
            algorithms: ["HS256"],
        }).unless(
            { path: [{ url: "/user/login", methods: ["POST"] },
                    { url: "/user/seeder", methods: ["POST"] },
                    { url: "/post/seeder", methods: ["POST"] },
                    { url: "/client/seeder", methods: ["POST"] },
                    { url: "/devis/seeder", methods: ["POST"] },
                    { url: "/company-order/seeder", methods: ["POST"] },
                    { url: "/company-order-piece/seeder", methods: ["POST"] },
                    { url: "/supplier/seeder", methods: ["POST"] },
                    { url: "/devis-piece/seeder", methods: ["POST"] },
                    { url: "/order/seeder", methods: ["POST"] },
                    { url: "/order-piece/seeder", methods: ["POST"] },
                    { url: "/user-post/seeder", methods: ["POST"] },
                    { url: "/operation/seeder", methods: ["POST"] },
                    { url: "/gamme-operation/seeder", methods: ["POST"] },
                    { url: "/gamme-produce-operation/seeder", methods: ["POST"] },
                    { url: "/role/seeder", methods: ["POST"] },
                    { url: "/piece/seeder", methods: ["POST"] },
                    { url: "/piece_ref/seeder", methods: ["POST"] },
                    { url: "/gamme/seeder", methods: ["POST"] },
                    { url: "/user/refresh/:id_user", methods: ["GET"] }] }),
    );
}

exports.initializeConfigMiddlewares = (app) => {
    initJsonHandlerMiddlware(app);
    initLoggerMiddlware(app);
    middlewareStatic(app);
    middlewareCors(app);
    middlewarePermissionsErrors(app);
    tokenMiddlware(app);

}

exports.initializeErrorMiddlwares = (app) => {
    app.use((err, req, res, next) => {
        if (err.code === 'permission_denied') {
            res.status(403).send('Forbidden');
            return
        }
        console.log(err)
        res.status(500).send(err.message);
    });
}