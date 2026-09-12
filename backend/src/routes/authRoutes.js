import express from 'express';
import validate from '../middleware/validate.js';
import { signupSchema, loginSchema } from '../schemas/authSchemas.js';
import { loginController, signupController } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post("/signup", validate(signupSchema), signupController)

authRouter.post("/login", validate(loginSchema), loginController)

export default authRouter;