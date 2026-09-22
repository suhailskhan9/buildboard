import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import { projectIdSchema, createProjectSchema, updateProjectSchema } from '../schemas/projectSchemas.js';
import { createProjectController, deleteProjectController, getAllProjectsController, getProjectByIdController, getProjectSummaryController, updateProjectController } from '../controllers/projectController.js';
import tasksRouter from './tasksRoutes.js';
import projectMemberRouter from './projectMemberRoutes.js';

const projectsRouter = express.Router()

projectsRouter.use(authMiddleware);

projectsRouter.get("/", getAllProjectsController);

projectsRouter.get("/:projectId", validate(projectIdSchema, "params"), getProjectByIdController);

projectsRouter.post("/", validate(createProjectSchema), createProjectController);

projectsRouter.patch("/:projectId", validate(projectIdSchema, "params"), validate(updateProjectSchema), updateProjectController);

projectsRouter.delete("/:projectId", validate(projectIdSchema, "params"), deleteProjectController);

projectsRouter.get('/:projectId/summary', validate(projectIdSchema, "params"), getProjectSummaryController);

projectsRouter.use('/', tasksRouter);

projectsRouter.use('/', projectMemberRouter);

export default projectsRouter;