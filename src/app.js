import express from 'express';
import { connectMongoDB } from './database/database.js';
import { config } from '../config.js';
import { watchMongoDB } from './util/schedule.js'
import logger from "./util/logger.js";

const app = express();

logger.info(' ============== server init ==============');
//mongo
connectMongoDB()
    .then((client) => {
        app.listen(config.host.port);
    })
    .catch(console.error);

watchMongoDB()
    .then(() => {
        logger.info('[app] watch start');
    })
    .catch(console.error);