import { prisma } from "@repo/db";
import 'dotenv/config';

async function seedRegions() {
  await prisma.region.create({
    data: {
      id: "india",
      name: "India",
    },
  });
}

seedRegions().then(() => {
  console.log("Seeding completed.");
  process.exit(0);
}).catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});