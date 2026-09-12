import { z } from 'zod';

export const getMembersParamsSchema = z.object({
    projectId: z.coerce.number().int().positive()
}).strict();
