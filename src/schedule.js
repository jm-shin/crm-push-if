import { ToadScheduler, SimpleIntervalJob, Task  } from 'toad-scheduler';
import { getPushInfo } from './database/database.js';
import * as pushAPI from './api/push.js';
import { ObjectId } from "mongodb";
import logger from "./util/logger.js";

export async function watchMongodb () {
    try {
        const scheduler = new ToadScheduler();

        const task = new Task('watch push_info collection', async () => {
            const count = await getPushInfo().countDocuments({});
            console.log(`count: ${count}`);
            if ( count > 0 ) {
                await scheduler.stop();
                const pushInfo = await getPushInfo().findOne({});

                logger.info(`push info: ${JSON.stringify(pushInfo)}`);

                await pushAPI.sendMessage(pushInfo);

                //remove push_info
                await getPushInfo().deleteOne({_id: new ObjectId(pushInfo._id.toString())});
                await scheduleRestart(scheduler, job);
            }
        });
        const job = new SimpleIntervalJob({ seconds: 5 }, task);
        await scheduler.addSimpleIntervalJob(job);
    } catch (err) {
        console.error(err);
    }
}

async function scheduleRestart(scheduler, job) {
    try {
        logger.info('scheduler restart!');
        await scheduler.addSimpleIntervalJob(job);
    } catch (err) {
        console.error(err);
    }
}