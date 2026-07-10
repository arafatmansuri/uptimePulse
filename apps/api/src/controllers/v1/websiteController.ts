import { prisma, websiteStatus } from "@repo/db";
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
    throw AppError.badRequest(
      validation.error.issues[0].message || "Invalid input",
      { field: validation.error.issues[0].path.join(".") },
    );
  }
  const { url, description } = validation.data;
  const isURLExists = await prisma.website.findFirst({
    where: { url: url, userId: userId },
  });
  if (isURLExists) {
    throw AppError.badRequest("Website with this URL already exists", {
      field: ["url"],
    });
  }
  const website = await prisma.website.create({
    data: {
      url: url,
      description: description,
      userId: userId,
    },
    include: {
      ticks: true,
    },
  });
  await prisma.websiteTick.create({
    data: {
      status: "Unknown",
      response_time_ms: 0,
      websiteId: website.id,
      regionId: "india",
    },
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
    include: {
      ticks: {
        take: 10,
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!website) {
    throw AppError.notFound("Website not found");
  }
  const tickCount = await prisma.websiteTick.count({
    where: { websiteId: req.params.id },
  });
  const upCount = await prisma.websiteTick.count({
    where: { websiteId: req.params.id, status: websiteStatus.UP },
  });
  const downCount = await prisma.websiteTick.count({
    where: { websiteId: req.params.id, status: websiteStatus.DOWN },
  });
  const avgResponseTime = await prisma.websiteTick.aggregate({
    where: { websiteId: req.params.id, status: websiteStatus.UP },
    _avg: { response_time_ms: true },
  });
  ApiResponse.success(
    res,
    {
      website,
      tickCount,
      upCount,
      downCount,
      avgResponseTime: avgResponseTime._avg.response_time_ms?.toFixed(0) || 0,
    },
    "Website retrieved successfully",
  );
});
export const getWebsites = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    throw AppError.unauthorized("User not authenticated");
  }
  await prisma.websiteTick.deleteMany({ where: { isTempTick: true } });
  const websites = await prisma.website.findMany({
    where: { userId: userId },
    include: {
      ticks: {
        take: 1,
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: { ticks: { where: { status: websiteStatus.UP } } },
      },
    },
  });
  if (!websites) {
    throw AppError.notFound("No websites found for this user");
  }
  const result: { avg_response: number }[] = await prisma.$queryRaw`
  SELECT AVG(latest.response_time_ms) AS avg_response
  FROM (
    SELECT DISTINCT ON ("websiteId") response_time_ms, status
    FROM "websiteTick"
    ORDER BY "websiteId", "createdAt" DESC
  ) latest
  WHERE latest.status = 'UP';
`;
  ApiResponse.success(
    res,
    {
      websites,
      totalWebsites: websites.length,
      avgResponseTime: result[0]?.avg_response || 0,
    },
    "Websites retrieved successfully",
  );
});
export const updateWebsite = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    throw AppError.unauthorized("User not authenticated");
  }
  const websiteId = req.params.id;
  if (!websiteId || typeof websiteId !== "string") {
    throw AppError.badRequest("Invalid website ID", { field: "id" });
  }
  const { url, description } = req.body;
  const website = await prisma.website.findUnique({
    where: { id: websiteId, userId: userId },
  });
  if (!website) {
    throw AppError.notFound("Website not found");
  }
  if (url && url !== website.url) {
    const isURLExists = await prisma.website.findFirst({
      where: { url: url, userId: userId },
    });
    if (isURLExists) {
      throw AppError.badRequest("Website with this URL already exists", {
        field: ["url"],
      });
    }
  }
  const updatedWebsite = await prisma.website.update({
    where: { id: websiteId, userId: userId },
    data: { url, description },
  });
  ApiResponse.success(
    res,
    { website: updatedWebsite },
    "Website updated successfully",
  );
});
export const deleteWebsite = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    throw AppError.unauthorized("User not authenticated");
  }
  const websiteId = req.params.id;
  if (!websiteId || typeof websiteId !== "string") {
    throw AppError.badRequest("Invalid website ID", { field: "id" });
  }
  const website = await prisma.website.findUnique({
    where: { id: websiteId, userId: userId },
  });
  if (!website) {
    throw AppError.notFound("Website not found");
  }
  await prisma.websiteTick.deleteMany({
    where: { websiteId: websiteId },
  });
  await prisma.website.delete({
    where: { id: websiteId, userId: userId },
  });
  ApiResponse.success(res, {}, "Website deleted successfully");
});
