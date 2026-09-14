import express from 'express';
import validate from '../middleware/validate.js';
import { addProjectMemberSchema, projectMemberParamsSchema, removeProjectMemberParamsSchema } from '../schemas/projectMemberSchemas.js';
import { addProjectMemberController, removeProjectMemberController, getMembersController } from '../controllers/projectMemberController.js';

const projectMemberRouter = express.Router();

projectMemberRouter.get('/:projectId/members', validate(projectMemberParamsSchema, "params"), getMembersController);

projectMemberRouter.post("/:projectId/members", validate(projectMemberParamsSchema, "params"), validate(addProjectMemberSchema), addProjectMemberController);

projectMemberRouter.delete("/:projectId/members/:userId", validate(removeProjectMemberParamsSchema, "params"), removeProjectMemberController);
export default projectMemberRouter;