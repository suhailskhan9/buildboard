    import bcrypt from 'bcrypt';
    import jwt from "jsonwebtoken";
    import logger from '../config/logger.js';
    import AppError from '../errors/AppError.js';
    import { config } from '../config/config.js';
    import * as authRepository from '../repositories/authRepository.js';

    export async function signup({ email, username, password}) {
        const existingEmail = await authRepository.findByEmail(email);

        if(existingEmail) {
            throw new AppError(409, "Email already exists");
        }
            
        const existingUsername = await authRepository.findByUsername(username);
        if(existingUsername) {
            throw new AppError(409, "Username already exists");
        }
            
        const passwordHash = await bcrypt.hash(password, 10);

        await authRepository.createUser({ email, username, passwordHash });
        
        logger.info(
            {
            email 
            },
            "User created"
        )
    }

    export async function login({ email, password }) {
        const user = await authRepository.findByEmail(email);

        if(!user) {
            logger.warn(
                { email },
                "Failed login attempt"
            )
            throw new AppError(401, "Invalid email or password");
        }

        const { id, password_hash } = user;
    
        const isPasswordValid = await bcrypt.compare(password, password_hash);
        if(!isPasswordValid) {
            logger.warn(
                { email },
                "Failed login attempt"
            )
            throw new AppError(401, "Invalid email or password");
        }

        const token = jwt.sign({ id, email }, config.jwt.secret, { 
            algorithm: config.jwt.algorithm, expiresIn: config.jwt.expiresIn 
        });

        logger.info(
            {userId: id},
            "User logged in"
        );

        return token;
    }