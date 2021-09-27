import MongoDB from 'mongodb';
import { config } from '../../config.js';

export function connectMongoDB() {
    return MongoDB.MongoClient.connect(config.mongo.host, {
        appName: config.mongo.appName,
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then((client) => {
        db = client.db();
    });
}

let db;

export function getPushInfo() {
    return db.collection('push_info');
}