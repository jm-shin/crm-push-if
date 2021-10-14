import request from "request-promise-native";
import { config } from "../../config.js";
import logger from "../util/logger.js";

export async function sendMessage(info) {
    try {
        const curDate = new Date();
        const { message, collection_name, intent_url, campaign_id } = info;
        const createdAt = curDate.toISOString().replace('T', ' ').slice(0, 19) + ' UTC+0900';

        const trialDate = new Date();
        trialDate.setHours(trialDate.getHours() + 9);
        trialDate.setSeconds(trialDate.getSeconds() + 30);

        const pushMsg = {
            contents:{
                en: message
            },
            send_after: trialDate.toISOString().replace(/T|\..+/g, ' ') + 'UTC+0900',
            data: {
                deeplink: intent_url
            }
        };

        const option = {
            method: 'POST',
            url: config.push_info.apiDomain + config.push_info.apiURL + collection_name + `&rootId=crm${campaign_id}`,
            headers: config.push_info.apiHeaders,
            form: {
                pushMessage: JSON.stringify(pushMsg)
            },
        };

        logger.info(`[push] request : ${JSON.stringify(option)}`);

        //api request
        await request(option).then((res) => {
            logger.info(`[api response] : ${JSON.stringify(res)}`);
            // if (typeof res.statusCode !== undefined) {
            //     const resCode	= res.statusCode;
            //     const resBody	= res.body ? JSON.parse(res.body) : {};
            //
            //     logger.info(`[push] request success [res statusCode: ${resCode}][res body: ${JSON.stringify(resBody)}]`);
            //
            //     if( resBody['returnCode'] && resBody['returnCode'] != 200 ) {
            //         throw new Error(`returnCode is ${resBody['returnCode']}`);
            //     }
            // }
        }).catch((err) => {
            logger.info(err);
            if (err) throw new Error(err);
        });
    } catch (err) {
        throw new Error(err);
    }
}