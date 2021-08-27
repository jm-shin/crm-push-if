import dotenv from 'dotenv';
dotenv.config();

function required(key, defaultValue = undefined) {
    const value = process.env[key] || defaultValue;
    if (value == null) {
        throw new Error(`Key ${key} is undefined`);
    }
    return value;
}

export const config = {
    host: {
        port: required('HOST_PORT')
    },
    mongo: {
        host: required('DB_MONGO_HOST')
    },
    push_info: {
        apiDomain:  required('PUSH_API_DOMAIN'),
        apiURL:     required('PUSH_API_URL'),
        apiHeaders: {
            'Accept':         		'application/x-www-form-urlencoded;charset=UTF-8',
            'Content-Type':   		'application/x-www-form-urlencoded',
        }
    }
}