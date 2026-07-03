import { prisma } from "@repo/db";
import { redisClient } from "@repo/redis-store";
import axios from "axios";
import 'dotenv/config';
import { websiteTickCreateManyInput } from "../../../packages/database/generated/prisma/models";

const main = async () => {
  const redis = await redisClient;
    // await redis.xGroupCreate("betterstack:website","india","0",{MKSTREAM:true});
    while(1){
      const res = await redis.xReadGroup("india","india-1",
        {
        id: ">",
        key: "betterstack:website",
        },
        {
          COUNT:2,
        });
    if(!res || res.length === 0){
        console.log("No new messages");
        prisma.$disconnect();
        await new Promise(resolve => setTimeout(resolve, 3000));
        continue;
    }
    console.log(JSON.stringify(res));
    let websitesToTrack: {id:string,message:{url:string,id:string}}[] = res[0]?.messages;
    const trackedWebsites:websiteTickCreateManyInput[] = [];
    websitesToTrack.forEach(async (website) => {
        // console.log("Tracking website:", website.id, website.message.url);
        let startTime = Date.now();
        axios.get(website.message.url).then(async () => {
            trackedWebsites.push({
                status: "UP",
                response_time_ms: Date.now() - startTime,
                websiteId: website.message.id,
                regionId: "india",
            });
        }).catch(async () => {
            trackedWebsites.push({
                status: "DOWN",
                response_time_ms: Date.now() - startTime,
                websiteId: website.message.id,
                regionId: "india",
            });
        })
    })
    await prisma.websiteTick.createMany({data: trackedWebsites});
    await redis.xAck("betterstack:website","india",websitesToTrack.map(website => website.id));
    // console.log("Read from redis:", JSON.stringify(res));
}
    // redisClient.destroy();
}

main();