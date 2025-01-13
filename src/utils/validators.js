import {z} from "zod";

export const userSchema = z.object({
    email: z.string().email(),
    name: z.string().min(2),
    password: z.string().min(6),
    role: z.string().optional()
})

export const userUpdateSchema = userSchema.partial()