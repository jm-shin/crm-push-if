import { config } from "../../config.js";
import logger from "../util/logger.js";
import mongoDB from 'mongodb'

const pool = mongoDB.MongoClient;
const dbName = 'CRM';
const desc = 'external_mongo';

const mongoOption = {
    appname: 'crm-oms',
    keepAlive: true,
    useUnifiedTopology:	true,
};

const insertMany = function(array) {
    const fn = 'insertMany';
    let result = [];
    return new Promise(function(resolve, reject) {
        //TODO: local test..
        pool.connect(config.push_info.apiDomain, mongoOption,  function(err, client) {
            if (err) {
                if (client) {
                    client.close(true);
                }
                reject(Error(`${fn} DB connection error`));
            }
            logger.debug(`${desc} ${fn} client connect`);

            const collectionName = array[0].collection;

            client.db(dbName).collection(collectionName).insertMany(array, function(err, result) {
                logger.debug(`${desc} ${fn} client ${collectionName} insertMany`);
                client.close(false);
                if(err) {
                    reject(err);
                }
                resolve(result);
            });
        });
    });
}	// insertMany

export { insertMany };