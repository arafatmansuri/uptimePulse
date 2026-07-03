import 'dotenv/config';
import { createClient } from 'redis';

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

const STREAM_NAME = "betterstack:website";

interface AddWebsite {
    id: string;
    url: string;
}

export async function xAdd(website: AddWebsite) {
    const redis = await redisClient;
    await redis.xAdd(STREAM_NAME,"*",{
        id: website.id,
        url: website.url,
    });
}

export async function xAddBulk(websites: AddWebsite[]) {
    for(let website of websites){
        await xAdd(website);
    }
}

export async function xCreateGroup(group: string, id: string) {
    const redis = await redisClient;
    await redis.xGroupCreate(STREAM_NAME, group, id, {MKSTREAM:true});
}

export async function xReadGroup(group: string, consumer: string, readOptions?: {COUNT?: number}) {
    const redis = await redisClient;
    return await redis.xReadGroup(group, consumer, {id:">",key:STREAM_NAME}, readOptions);
}

export async function xAck(group: string, ids: string[]) {
    const redis = await redisClient;
    return await redis.xAck(STREAM_NAME, group, ids);
}