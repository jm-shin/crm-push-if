import { ToadScheduler, SimpleIntervalJob, Task  } from 'toad-scheduler';
import { getPushInfo } from '../database/database.js';
import * as pushAPI from '../api/push.js';
import logger from "./logger.js";
import * as external_mongo from '../database/external_mongo.js'

export async function watchMongoDB () {
    try {
        const scheduler = new ToadScheduler();
        const task = new Task('watch push_info collection', async () => {
            const count = await getPushInfo().countDocuments({});
            //console.log(`count: ${count}`);
            if ( count > 0 ) {
                const currentHour = new Date().getHours();
                //console.log('curTime: ' + currentHour);

                await scheduler.stop();

                //limit time
                if (currentHour >= 8 && currentHour < 20) {
                    //push_info select
                    const pushInfo = await getPushInfo().find({}).limit(100000).toArray();
                    // logger.info(`[schedule] push info: ${JSON.stringify(pushInfo)}`);
                    
                    //insert wavve push DataBase
                    await external_mongo.insertMany(pushInfo);

                    //wavve-push api request
                    await pushAPI.sendMessage(pushInfo[0]);

                    const docId = pushInfo.reduce((acc, cur, i) => {
                        acc.push(cur._id);
                        return acc;
                    }, []);

                    //push_info deleteMany
                    await getPushInfo().deleteMany({_id: {$in : docId }});
                }
                await scheduleRestart(scheduler, job);
            }
        });
        const job = new SimpleIntervalJob({ seconds: 300 }, task); //5min
        await scheduler.addSimpleIntervalJob(job);

    } catch (err) {
        console.error(err);
    }
}

async function scheduleRestart(scheduler, job) {
    try {
        logger.info('[schedule] scheduler restart!');
        await scheduler.addSimpleIntervalJob(job);
    } catch (err) {
        console.error(err);
    }
}