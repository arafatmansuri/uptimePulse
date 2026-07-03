import { prisma } from "@repo/db";
import { redisClient } from "@repo/redis-store";
import 'dotenv/config';

interface AddWebsite {
    id: string;
    url: string;
}

const addWebsite = async () => {
    const redis = await redisClient;
    // await prisma.$connect();
    let websites: AddWebsite[] = await prisma.website.findMany({
      select:{
        id:true,
        url:true,
      }
    });
    for(let website of websites){
        await redis.xAdd("betterstack:website","*",{
            id: website.id,
            url: website.url,
        });
    }
    console.log("Added websites to redis:", JSON.stringify(websites));
    // setTimeout(async () => {
    //   await addWebsite();
    // }, 3*60*1000);
    // redis.destroy();
    // prisma.$disconnect();
}

setInterval(addWebsite, 1 * 60 * 1000);