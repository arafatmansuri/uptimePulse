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

async function trackWebsites(websiteToTrack: GroupMessage) {
   return new Promise<websiteTickCreateManyInput>(async (resolve, reject) => {
    const startTime = Date.now();
    await axios.get(websiteToTrack.message.url, {timeout: 5000}).then(() => {
        resolve({
            websiteId: websiteToTrack.message.id,
            response_time_ms: Date.now() - startTime,
            regionId: "india",
            status:"UP"
        });
    }).catch(() => {
        resolve({
            websiteId: websiteToTrack.message.id,
            response_time_ms: Date.now() - startTime,
            regionId: "india",
            status:"DOWN"
        });
    })
   })
}

const main = async () => {
    while(1){
    const res = await xReadGroup(CONSUMER_GROUP,WORKER_ID,{COUNT:5});
    if(!res || res.length === 0){
        console.log("No new messages");
        await new Promise(resolve => setTimeout(resolve, 1000*5));
        continue;
    }
    let websitesToTrack: GroupMessage[] = res[0]?.messages;
    const trackedWebsites:websiteTickCreateManyInput[] = await Promise.all(websitesToTrack.map(trackWebsites));
    await prisma.websiteTick.createMany({data: trackedWebsites});
    await xAck(CONSUMER_GROUP,websitesToTrack.map(w => w.id));
    console.log(`Processed ${websitesToTrack.length} websites`);
}
}

main();