import { z } from 'zod';

export const projectIdSchema = z.object({
    projectId: z.coerce.number().int().positive()
})

export const createProjectSchema = z.object({
    name: z.string().trim().min(3).max(50),
    description: z.string().max(500).optional()
})

export const updateProjectSchema = z.object({
    name: z.string().trim().min(3).max(50)
})