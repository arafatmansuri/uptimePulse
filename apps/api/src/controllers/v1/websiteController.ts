import { prisma } from "@repo/db";  
import { ApiResponse } from "../../lib/ApiResponse";
import { AppError } from "../../lib/AppError";
import { asyncHandler } from "../../lib/asyncHandler";
import { addWebsiteSchema } from "../../validations/websiteValidation";


export const addWebsite = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw AppError.unauthorized("User not authenticated");
    }
    const validation = addWebsiteSchema.safeParse(req.body);
    if (!validation.success) {
        throw AppError.badRequest(validation.error.issues[0].message || "Invalid input", { field: validation.error.issues[0].path.join(".") });
    }
    const {url,description} = validation.data;
    const isURLExists = await prisma.website.findFirst({where:{url:url,userId:userId}});
    if(isURLExists){
        throw AppError.badRequest("Website with this URL already exists", { field: ["url"] });
    }
    const website = await prisma.website.create({
        data: {
            url: url,
            description: description,
            userId: userId
        }
    });
    ApiResponse.success(res, { website }, "Website added successfully", 201);
});
export const getWebsiteStatus = asyncHandler(async (req, res) => {
    if (!req.params.id || typeof req.params.id !== "string") {
        throw AppError.badRequest("Invalid website ID", { field: "id" });
    }
    const userId = req.user?.id;
    if (!userId) {
        throw AppError.unauthorized("User not authenticated");
    }
    const website = await prisma.website.findUnique({
        where: { id: req.params.id, userId: userId },
        include: { ticks: {
            take:1,
            orderBy: { createdAt: "desc" }
        } }
    });
    if (!website) {
        throw AppError.notFound("Website not found");
    }
    ApiResponse.success(res, { website }, "Website retrieved successfully");
});
export const getWebsites = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw AppError.unauthorized("User not authenticated");
    }
    const websites = await prisma.website.findMany({
        where: { userId: userId },
        include: { ticks: {
            take:1,
            orderBy: { createdAt: "desc" }
        } }
    });
    if (!websites) {
        throw AppError.notFound("No websites found for this user");
    }
    ApiResponse.success(res, { websites, totalWebsites: websites.length }, "Websites retrieved successfully");
});