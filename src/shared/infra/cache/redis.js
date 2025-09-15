import {createClient} from 'redis';
import {appConfig} from "../../../config/app-config.js";

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

redisClient.on('error', err => console.log('Redis Client Error', err));

const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (err) {
        console.error('Could not connect to Redis', err.message);
    }
};

await connectRedis();
export default redisClient;


