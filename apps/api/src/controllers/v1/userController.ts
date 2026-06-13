import { prisma } from "@repo/db";
import { ApiResponse } from "../../lib/ApiResponse";
import { asyncHandler } from "../../lib/asyncHandler";

export const getUsers = asyncHandler(async (req, res) => {
    const users = await prisma.user.findMany();
    ApiResponse.success(res,{ users }, "Users retrieved successfully");
});