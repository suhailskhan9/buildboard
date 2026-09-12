import express from 'express';
import validate from '../middleware/validate.js';
import { addProjectMemberSchema, projectMemberParamsSchema } from '../schemas/projectMemberSchemas.js';
import { addProjectMemberController, getMembersController } from '../controllers/projectMemberController.js';

const projectMemberRouter = express.Router();

projectMemberRouter.get('/:projectId/members', validate(projectMemberParamsSchema, "params"), getMembersController);

projectMemberRouter.post("/:projectId/members", validate(projectMemberParamsSchema, "params"), validate(addProjectMemberSchema), addProjectMemberController);

export default projectMemberRouter;