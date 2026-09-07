import express from 'express';
import validate from '../middleware/validate.js';
import { createTaskController, getTasksController, getTaskByIdController, updateTaskController } from '../controllers/taskController.js';
import { createTaskSchema, getTaskByIdParamsSchema, getTasksSchema, updateTaskSchema, updateTaskParamsSchema } from '../schemas/taskSchemas.js';
import { projectIdSchema } from '../schemas/projectSchemas.js';


const tasksRouter = express.Router();

tasksRouter.post('/:projectId/tasks', validate(projectIdSchema, "params"), validate(createTaskSchema), createTaskController)

tasksRouter.get('/:projectId/tasks', validate(projectIdSchema, "params"), validate(getTasksSchema, "query"), getTasksController)

tasksRouter.get('/:projectId/tasks/:taskId', validate(getTaskByIdParamsSchema, "params"), getTaskByIdController)

tasksRouter.patch('/:projectId/tasks/:taskId', validate(updateTaskParamsSchema, "params"), validate(updateTaskSchema), updateTaskController)
export default tasksRouter;