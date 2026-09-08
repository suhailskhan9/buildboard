import { z } from 'zod';

export const createTaskSchema = z.object({
    title: z.string().trim().min(3).max(50),
    description: z.string().trim().max(1000).optional(),
    assigned_to_id: z.coerce.number().int().positive().optional(),
    status: z.enum(["todo", "in_progress", "done"]).default("todo"),
    due_date: z.iso.date().optional()
})

export const getTasksSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    status: z.enum(["todo", "in_progress", "done"]).optional(),
    assigned_to_id: z.coerce.number().int().positive().optional(),
    search: z.string().trim().min(1).max(100).optional() 
}).strict();

export const getTaskByIdParamsSchema = z.object({
    projectId: z.coerce.number().int().positive(),
    taskId: z.coerce.number().int().positive()
}).strict();

export const updateTaskSchema = z.object({
    title: z.string().trim().min(3).max(50).optional(),
    description: z.string().trim().max(1000).optional(),
    assigned_to_id: z.coerce.number().int().positive().nullable().optional(),
    status: z.enum(["todo", "in_progress", "done"]).optional(),
    due_date: z.iso.date().nullable().optional()
}).strict().refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "At least one field must be provided for update"
    }
)

export const updateTaskParamsSchema = z.object({
    projectId: z.coerce.number().int().positive(),
    taskId: z.coerce.number().int().positive()
}).strict();

export const deleteTaskParamsSchema = z.object({
    projectId: z.coerce.number().int().positive(),
    taskId: z.coerce.number().int().positive()
}).strict();

