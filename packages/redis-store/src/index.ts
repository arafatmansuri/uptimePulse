import { createClient } from 'redis';
import 'dotenv/config';

export const createRedisConnection = async () => {
    return await createClient({url: process.env.REDIS_URL || 'redis://localhost:6379'}).on("error", (err) => {
        console.error("Redis client error", err);
    }).connect();
}

export const redisClient = createRedisConnection().then(client => {
    console.log("Redis client connected");
    return client;
}).catch(err => {
    console.error("Redis client connection error", err);
    process.exit(1);
});