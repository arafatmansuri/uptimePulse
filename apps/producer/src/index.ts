import { prisma } from "@repo/db";
import { redisClient } from "@repo/redis-store";

interface AddWebsite {
    id: string;
    url: string;
}

const addWebsite = async () => {
    let websites: AddWebsite[] = await prisma.website.findMany({
      select:{
        id:true,
        url:true,
      }
    });
    const res1 = await redisClient.xAdd(
  'betterstack:website', '*', {websites: JSON.stringify(websites)}
);
console.log(res1);
redisClient.destroy();
}

setInterval(addWebsite,3*60*1000)