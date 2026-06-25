import { prisma } from "@repo/db";

declare global {
    namespace Express {
        interface Request {
        user?: Awaited<ReturnType<typeof prisma.user.findFirst>>;
        }
    }
}