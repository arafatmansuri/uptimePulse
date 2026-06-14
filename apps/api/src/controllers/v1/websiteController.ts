import { prisma } from "@repo/db";
import { asyncHandler } from "../../lib/asyncHandler";

export const addWebsite = asyncHandler(async (req, res) => {
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
        return res.status(400).json({ message: "Website ID is required" });
    }
        const website = await prisma.website.findUnique({
            where: { id: req.params.id },
            include: { ticks: true }
        });
        if (!website) {
            return res.status(404).json({ message: "Website not found" });
        }
        res.json({ website });
});