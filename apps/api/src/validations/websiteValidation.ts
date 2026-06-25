import z from "zod";

export const addWebsiteSchema = z.object({
    url: z.url({error: "Invalid URL format"}).nonempty({message: "URL is required"}).nonoptional({error: "URL is required"}),
    description: z.string().optional()
})