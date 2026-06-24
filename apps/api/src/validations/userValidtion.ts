import { z } from 'zod';

export const signUpSchema = z.object({
    name: z.string().nonempty({message: "Name is required"}).nonoptional({error: "Name is required"}),
    email: z.email({message: "Invalid email format"}).nonempty({message: "Email is required"}).nonoptional({error: "Email is required"}),
    password: z.string().min(8, {message: "Password must be at least 8 characters long"}).nonempty({message: "Password is required"}).nonoptional({error: "Password is required"}),
    confirmPassword: z.string().min(8, {message: "Confirm Password must be at least 8 characters long"}).nonempty({message: "Confirm Password is required"}).nonoptional({error: "Confirm Password is required"})
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
}
);
export const signInSchema = z.object({
    email: z.email({message: "Invalid email format"}).nonempty({message: "Email is required"}).nonoptional({error: "Email is required"}),
    password: z.string().min(8, {message: "Password must be at least 8 characters long"}).nonempty({message: "Password is required"}).nonoptional({error: "Password is required"}),
});
