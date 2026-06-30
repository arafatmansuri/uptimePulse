import { prisma } from "@repo/db";
import { redisClient } from "@repo/redis-store";
import axios from "axios";
import 'dotenv/config';

const main = async () => {
    // await redisClient.xGroupCreate("betterstack:website","india","0",{MKSTREAM:true});
    while(1){const res = await redisClient.xReadGroup("india","india-1",{
        id: ">",
        key: "betterstack:website",
    },{
        COUNT:2,
    });
    if(!res || res.length === 0){
        console.log("No new messages");
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
    }
    let websitesToTrack: {id:string,url:string}[] = res[0]?.messages;
    websitesToTrack.forEach(async (website) => {
        console.log("Tracking website:", website.id, website.url);
        let startTime = Date.now();
        axios.get(website.url).then(async () => {
            await prisma.websiteTick.create({
                data:{
                  status: "UP",
                  response_time_ms: Date.now() - startTime,
                  websiteId: website.id,
                  regionId: "india",
                }
            })
        })
    });
    console.log("Read from redis:", JSON.stringify(res));
}
    // redisClient.destroy();
}

main();