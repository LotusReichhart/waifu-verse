import express from 'express';
import path from 'path';
import cors from "cors";
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';
import methodOverride from 'method-override';
import passport from "passport";

import {fileURLToPath} from 'url';
import {dirname} from 'path';
import {appConfig} from "../config/app-config.js";

import '../shared/infra/passport/passport.js';

import {getClientIp} from "./middlewares/ip-middleware.js";
import {i18nRedirectMiddleware} from "./middlewares/i18n-redirect-middleware.js";
import {i18nMiddleware} from "./middlewares/i18n-middleware.js";
import connectToMongoDB from "../shared/infra/database/mongo.js";
import {errorHandler, notFoundHandler} from "./middlewares/error.middleware.js";

import appRoutes from './presentation/route.js';
import authRoutes from '../modules/auth/auth-routes.js';

import apiRoutes from '../modules/api/api-routes.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __rootDir = path.join(__dirname, '../../');

connectToMongoDB().then(r => {
});

if (appConfig.environment === 'production') {
    app.use(cors({
        origin: true
    }));
} else {
    app.use(cors({
        origin: appConfig.server.domain,
        credentials: true
    }));
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.static(path.join(__rootDir, 'public')));

if (appConfig.environment === "production") {
    app.set("trust proxy", 1);
} else {
    app.set("trust proxy", false);
}

app.use(session({
    secret: appConfig.auth.sessionSecret || 'keyboard_cat',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(getClientIp);

app.use(i18nRedirectMiddleware);

app.use('/:lang', i18nMiddleware, (req, res, next) => {
    next();
});

app.use('/:lang', appRoutes)
app.use('/:lang/auth', authRoutes);

app.use("/api", i18nMiddleware);
app.use("/api", apiRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

export {app} ;
