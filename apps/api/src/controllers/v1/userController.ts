import { prisma } from "@repo/db";
import { ApiResponse } from "../../lib/ApiResponse";
import { AppError } from "../../lib/AppError";
import { asyncHandler } from "../../lib/asyncHandler";
import { comparePasswords, generateToken, hashPassword } from "../../utils/userUtils";
import { signInSchema, signUpSchema } from "../../validations/userValidtion";

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
    const existingUser = await prisma.user.findFirst({where:{email:email,name:name}});
    if (existingUser) {
        throw AppError.badRequest("User with this email or name already exists", { field: ["email", "name"] });
    }
    const hasedPassword = await hashPassword(password);
    const newUser = await prisma.user.create({
        data: {
            name:name,
            email:email,
            password: hasedPassword
        }
    });
    const accessToken = generateToken(newUser.id, 'access');
    const refreshToken = generateToken(newUser.id, 'refresh');
    await prisma.user.update({
        where: { id: newUser.id },
        data: { refreshToken:refreshToken }
    });
    ApiResponse.success(res, { user: newUser,token:accessToken }, "User created successfully", 201,[
        {name:"access_token", value:accessToken, options:{httpOnly:true, secure:true, sameSite:"none", maxAge: 3600000, path:"/"}},
        {name:"refresh_token", value:refreshToken, options:{httpOnly:true, secure:true, sameSite:"none", maxAge: 3600000, path:"/"}}
    ]);
});
export const signIn = asyncHandler(async (req,res) => {
   const parsedSignInData = signInSchema.safeParse(req.body);
   
   if (!parsedSignInData.success) {
    throw AppError.badRequest(parsedSignInData.error.issues[0].message || "Invalid input", { field: parsedSignInData.error.issues[0].path.join(".") });
   }
   const { email, password } = parsedSignInData.data;
    const user = await prisma.user.findFirst({where:{email:email}});
    if (!user) {
        throw AppError.badRequest("User not found", { field: ["email"] });
    }
    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
        throw AppError.badRequest("Invalid password", { field: ["password"] });
    }
    const accessToken = generateToken(user.id, 'access');
    const refreshToken = generateToken(user.id, 'refresh');
    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken:refreshToken }
    });
    ApiResponse.success(res, { user: user,token:accessToken }, "User signed in successfully", 200,[
        {name:"access_token", value:accessToken, options:{httpOnly:true, secure:true, sameSite:"none", maxAge: 3600000, path:"/"}},
        {name:"refresh_token", value:refreshToken, options:{httpOnly:true, secure:true, sameSite:"none", maxAge: 3600000, path:"/"}}
    ]);
});
export const getuser = asyncHandler(async (req,res) => {
    const user = req.user;
    if (!user) {
        throw AppError.unauthorized("User not authenticated");
    }
    ApiResponse.success(res, { user }, "User retrieved successfully");
});