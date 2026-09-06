import express from 'express';
import validate from '../middleware/validate.js';
import { createTaskController, getTasksController } from '../controllers/taskController.js';
import { createTaskSchema, getTasksSchema } from '../schemas/taskSchemas.js';
import { projectIdSchema } from '../schemas/projectSchemas.js';


const tasksRouter = express.Router();

tasksRouter.post('/:projectId/tasks', validate(projectIdSchema, "params"), validate(createTaskSchema), createTaskController)

tasksRouter.get('/:projectId/tasks', validate(projectIdSchema, "params"), validate(getTasksSchema, "query"), getTasksController)

export default tasksRouter;