import { prisma } from "@repo/db";
import { AppError } from "../lib/AppError";
import { asyncHandler } from "../lib/asyncHandler";
import { verifyToken } from "../utils/userUtils";

export const userMiddleware = asyncHandler(async (req, res, next) => {
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
        throw AppError.unauthorized("Access token not found");
    }
    const decodedToken = verifyToken(accessToken, 'access');
    if (!decodedToken || !decodedToken.userId) {
        throw AppError.unauthorized("Invalid access token");
    }
    const user = await prisma.user.findFirst({
      where: { id: decodedToken.userId },
      omit: { password: true, refreshToken: true },
    });
    if (!user) {
        throw AppError.unauthorized("User not found");
    }
    req.user = user;
    next();
});