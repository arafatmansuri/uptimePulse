import { prisma } from "@repo/db";
import { xAddBulk } from "@repo/redis-store";
import 'dotenv/config';

interface AddWebsite {
    id: string;
    url: string;
}

const main = async () => {
    let websites: AddWebsite[] = await prisma.website.findMany({
      select:{
        id:true,
        url:true,
      }
    });
    await xAddBulk(websites);
    console.log(`Added ${websites.length} websites to redis stream`);
}

setInterval(main, 1 * 60 * 1000);

main();