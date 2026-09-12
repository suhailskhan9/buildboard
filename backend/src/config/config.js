import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

export const config = z.object({
    port: z.coerce.number().int().positive().max(65535).default(3000),
    database: z.object({
        host: z.string().min(1),
        port: z.coerce.number().int().positive().max(65535),
        name: z.string().min(1),
        user: z.string().min(1),
        password: z.string().min(1)
    }),
    jwt: z.object({
        secret: z.string().min(32),
        algorithm: z.literal("HS256"),
        expiresIn: z.literal("15m")
    }),
}).parse({
    port: process.env.PORT,

    database: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    },

    jwt: {
        secret: process.env.SECRET_KEY,
        algorithm: "HS256",
        expiresIn: "15m"
    }
})