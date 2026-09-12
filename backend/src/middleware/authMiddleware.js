import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';
import { config } from '../config/config.js';

function authMiddleware(req, res, next) {
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader) {
            return res.status(401).json({
                message: "Authorization token missing"
            })
        }
        
        const authHeaderParts = authHeader.split(" ");
        if(authHeaderParts.length !== 2 || authHeaderParts[0] !== "Bearer") {
            return res.status(401).json({
                message: "Malformed authorization header"
            }) 
        }

        const token = authHeaderParts[1];
        const decodedToken = jwt.verify(token, config.jwt.secret, {
            algorithms: [config.jwt.algorithm]
        });

        req.user = decodedToken;
        next();
    }
    catch(err) {
        if(err instanceof jwt.JsonWebTokenError ) {
            logger.warn(
                { 
                    method: req.method, 
                    url: req.originalUrl, 
                    error: err.message
                }, 
                "JWT authentication failed"
            );
            return res.status(401).json({
                message: "Authentication failed"
            })
        }
        next(err);
    }
}

export default authMiddleware;