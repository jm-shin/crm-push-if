import express from 'express';
import { connectMongoDB } from './database/database.js';
import { config } from '../config.js';
import {watchMongodb} from './schedule.js'
import logger from "./util/logger.js";

const app = express();

logger.info(' ============== server init ==============');
//mongo
connectMongoDB()
    .then((client) => {
        app.listen(config.host.port);
    })
    .catch(console.error);

watchMongodb()
    .then(() => {
        logger.info('watch start');
    })
    .catch(console.error);