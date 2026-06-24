import { prisma } from "@repo/db";
import { ApiResponse } from "../../lib/ApiResponse";
import { AppError } from "../../lib/AppError";
import { asyncHandler } from "../../lib/asyncHandler";
import { generateToken, hashPassword } from "../../utils/userUtils";
import { signUpSchema } from "../../validations/userValidtion";

export const getUsers = asyncHandler(async (req, res) => {
    const users = await prisma.user.findMany();
    ApiResponse.success(res,{ users }, "Users retrieved successfully");
});

export const signUp = asyncHandler(async (req,res) => {
   const parsedSignupData = signUpSchema.safeParse(req.body);
   
   if (!parsedSignupData.success) {
    throw AppError.badRequest(parsedSignupData.error.issues[0].message || "Invalid input", { field: parsedSignupData.error.issues[0].path.join(".") });
   }
   const { name, email, password } = parsedSignupData.data;
    const existingUser = await prisma.user.findUnique({where:{email,name}});
    if (existingUser) {
        throw AppError.badRequest("User with this email or name already exists", { field: ["email", "name"] });
    }
    const hasedPassword = await hashPassword(password);
    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hasedPassword
        }
    });
    const accessToken = generateToken(newUser.id, 'access');
    const refreshToken = generateToken(newUser.id, 'refresh');
    await prisma.user.update({
        where: { id: newUser.id },
        data: { refreshToken }
    });
    ApiResponse.success(res, { user: newUser }, "User created successfully", 201,[
        {name:"access_token", value:accessToken, options:{httpOnly:true, secure:true, sameSite:"none", maxAge: 3600000, path:"/"}},
        {name:"refresh_token", value:refreshToken, options:{httpOnly:true, secure:true, sameSite:"none", maxAge: 3600000, path:"/"}}
    ]);
});