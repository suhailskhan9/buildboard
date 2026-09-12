import express from 'express';
import validate from '../middleware/validate.js';
import { getMembersParamsSchema } from '../schemas/projectMemberSchemas.js';
import { getMembersController } from '../controllers/projectMemberController.js';

const projectMemberRouter = express.Router();

projectMemberRouter.get('/:projectId/members', validate(getMembersParamsSchema, "params"), getMembersController);

export default projectMemberRouter;