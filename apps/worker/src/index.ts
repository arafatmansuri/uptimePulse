import { prisma } from "@repo/db";
import { xAck, xReadGroup } from "@repo/redis-store";
import axios from "axios";
import 'dotenv/config';
import { websiteTickCreateManyInput } from "../../../packages/database/generated/prisma/models";

const CONSUMER_GROUP = "india";
const WORKER_ID = "india-1";

type GroupMessage = {
    id:string;
    message:{
        url:string;
        id:string;
    }
}

const main = async () => {
    while(1){
    const res = await xReadGroup(CONSUMER_GROUP,WORKER_ID,{COUNT:5});
    if(!res || res.length === 0){
        console.log("No new messages");
        await new Promise(resolve => setTimeout(resolve, 1000*60));
        continue;
    }
    let websitesToTrack: GroupMessage[] = res[0]?.messages;
    const trackedWebsites:websiteTickCreateManyInput[] = await trackWebsites(websitesToTrack);
    await prisma.websiteTick.createMany({data: trackedWebsites});
    await xAck(CONSUMER_GROUP,websitesToTrack.map(w => w.id));
}
}

async function trackWebsites(websitesToTrack: GroupMessage[]) {
   const trackedWebsites:websiteTickCreateManyInput[] = [];
    websitesToTrack.forEach(async (website) => {
        let startTime = Date.now();
        axios.get(website.message.url).then(async () => {
            trackedWebsites.push({
                status: "UP",
                response_time_ms: Date.now() - startTime,
                websiteId: website.message.id,
                regionId: CONSUMER_GROUP,
            });
        }).catch(async () => {
            trackedWebsites.push({
                status: "DOWN",
                response_time_ms: Date.now() - startTime,
                websiteId: website.message.id,
                regionId: CONSUMER_GROUP,
            });
        })
    }) 
    return trackedWebsites;
}

main();