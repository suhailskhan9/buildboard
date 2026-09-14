import express from 'express';
import validate from '../middleware/validate.js';
import { addProjectMemberSchema, projectParamsSchema, memberParamsSchema, updateProjectMemberSchema } from '../schemas/projectMemberSchemas.js';
import { addProjectMemberController, removeProjectMemberController, getMembersController, updateProjectMemberController } from '../controllers/projectMemberController.js';

const projectMemberRouter = express.Router();

projectMemberRouter.get('/:projectId/members', validate(projectParamsSchema, "params"), getMembersController);

projectMemberRouter.post("/:projectId/members", validate(projectParamsSchema, "params"), validate(addProjectMemberSchema), addProjectMemberController);

projectMemberRouter.delete("/:projectId/members/:userId", validate(memberParamsSchema, "params"), removeProjectMemberController);

projectMemberRouter.patch("/:projectId/members/:userId", validate(memberParamsSchema, "params"), validate(updateProjectMemberSchema), updateProjectMemberController);

export default projectMemberRouter;