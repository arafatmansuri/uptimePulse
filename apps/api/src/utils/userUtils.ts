import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { env } from '../config';
import { AppError } from '../lib/AppError';


export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

export const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
}

export const generateToken = (userId: string,type: 'access' | 'refresh'): string => {
    return jwt.sign(
        { userId }, 
        type === 'access' ? env.ACCESS_TOKEN_SECRET : env.REFRESH_TOKEN_SECRET,
        { expiresIn: type === 'access' ? ACCESS_TOKEN_EXPIRATION : REFRESH_TOKEN_EXPIRATION }
    );
}
export const verifyToken = (token: string, type: 'access' | 'refresh'): { userId: string } => {
    try {
        return jwt.verify(token, type === 'access' ? env.ACCESS_TOKEN_SECRET : env.REFRESH_TOKEN_SECRET) as { userId: string };
    } catch (error) {
        throw AppError.unauthorized("Invalid token");
    }
}