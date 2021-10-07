import request from "request-promise-native";
import { config } from "../../config.js";
import logger from "../util/logger.js";

export async function sendMessage(info) {
    try {
        const { message, collection_name, intent_url } = info;
        const createdAt = info.created_at.toISOString().replace('T', ' ').slice(0, 19) + ' UTC+0900';
        const option = {
            url: config.push_info.apiDomain + config.push_info.apiURL + collection_name,
            method: 'POST',
            json: true,
            headers: config.push_info.apiHeaders,
            body: {
                pushMessage: {
                        contents:{
                            en: message
                        },
                        send_after: createdAt,
                    data: {
                        deeplink: intent_url
                    }
                }
            },
        };

        logger.info(`[push] request : ${JSON.stringify(option)}`);

        //api request
        await request(option).then((res) => {
            const resCode	= res.statusCode;
            const resBody	= res.body ? JSON.parse(res.body) : {};

            logger.info(`[push] request success [res statusCode: ${resCode}][res body: ${JSON.stringify(resBody)}]`);

            if( resBody['returnCode'] && resBody['returnCode'] != 200 ) {
                throw new Error(`returnCode is ${resBody['returnCode']}`);
            }
        }).catch((err) => {
            if (err) throw new Error(err);
        });

    } catch (err) {
        logger.error(err);
    }
}