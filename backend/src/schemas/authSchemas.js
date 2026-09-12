import { z } from 'zod';

export const loginSchema = z.object({  // incoming value must be an object
    email: z.string().trim().email(),                // This prop must be a string 
    password: z.string().min(8).max(128)
})

export const signupSchema = z.object({
    email: z.string().trim().email(),
    username: z.string().trim().min(3).max(30),
    password: z.string().min(8).max(128)
})