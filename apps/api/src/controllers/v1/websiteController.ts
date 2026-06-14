import { prisma } from "@repo/db";
import z from "zod";
import { AppError } from "../../lib/AppError";
import { asyncHandler } from "../../lib/asyncHandler";

const addWebsiteSchema = z.object({
    url: z.url({error: "Invalid URL format"}).nonempty({message: "URL is required"}).nonoptional({error: "URL is required"}),
    description: z.string().optional()
});


export const addWebsite = asyncHandler(async (req, res) => {
    const validation = addWebsiteSchema.safeParse(req.body);
    if (!validation.success) {
        AppError.badRequest(validation.error.issues[0].message || "Invalid input", { field: validation.error.issues[0].path.join(".") });
    }
    const website = await prisma.website.create({
        data: {
            url: req.body.url,
            description: req.body.description
        }
    });
    res.status(201).json({ website });
});
export const getWebsiteStatus = asyncHandler(async (req, res) => {
    if (!req.params.id || typeof req.params.id !== "string") {
        AppError.badRequest("Invalid website ID", { field: "id" });
        return;
    }
        const website = await prisma.website.findUnique({
            where: { id: req.params.id },
            include: { ticks: true }
        });
        if (!website) {
            AppError.notFound("Website not found");
            return;
        }
        res.json({ website });
});