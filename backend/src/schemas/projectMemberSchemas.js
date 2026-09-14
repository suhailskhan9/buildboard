import { z } from 'zod';

export const projectParamsSchema = z.object({
    projectId: z.coerce.number().int().positive()
}).strict();

export const addProjectMemberSchema = z.object({
    user_id: z.coerce.number().int().positive(),
    role: z.enum(["editor", "viewer"])
}).strict();

export const memberParamsSchema = z.object({
    projectId: z.coerce.number().int().positive(),
    userId: z.coerce.number().int().positive() 
}).strict();

export const updateProjectMemberSchema = z.object({
    role: z.enum(["editor", "viewer"])
}).strict();