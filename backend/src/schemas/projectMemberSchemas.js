import { z } from 'zod';

export const projectMemberParamsSchema = z.object({
    projectId: z.coerce.number().int().positive()
}).strict();

export const addProjectMemberSchema = z.object({
    user_id: z.coerce.number().int().positive(),
    role: z.enum(["editor", "viewer"])
}).strict();