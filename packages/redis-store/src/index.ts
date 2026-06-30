import { createClient } from 'redis';

export const createRedisConnection = async () => {
    return await createClient({url: process.env.REDIS_URL || 'redis://localhost:6379'}).on("error", (err) => {
        console.error("Redis client error", err);
    }).connect();
}

export const redisClient = await createRedisConnection();