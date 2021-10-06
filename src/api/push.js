import request from "request-promise-native";
import { config } from "../../config.js";
import logger from "../util/logger.js";

export async function sendMessage(info) {
    const { message, collection_name } = info;
    const option = {
        url: config.push_info.apiDomain + config.push_info.apiURL + collection_name,
        method: 'POST',
        json: true,
        headers: config.push_info.apiHeaders,
        body: {
            pushMessage: message
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
}