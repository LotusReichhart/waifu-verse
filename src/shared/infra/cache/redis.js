import {createClient} from 'redis';
import {appConfig} from "../../../config/app-config.js";
import {loggerHelper} from "../../utils/logger-helper.js";

const redisClient = createClient({
    socket: {
        host: appConfig.redis.host,
        port: appConfig.redis.port,
    },
    password: appConfig.redis.password,
    reconnectStrategy: (retries) => {
        if (retries > 20) {
            return new Error("Redis reconnect failed after 20 attempts");
        }
        return Math.min(retries * 100, 3000);
    },
    tls: true,
});

redisClient.on('error', err => loggerHelper.error('Redis Client Error', {error: err}));

const connectRedis = async () => {
    try {
        await redisClient.connect();
        loggerHelper.info('Connected to Redis');
    } catch (err) {
        loggerHelper.error('Could not connect to Redis', {error: err.message});
    }
};

await connectRedis();
export default redisClient;
