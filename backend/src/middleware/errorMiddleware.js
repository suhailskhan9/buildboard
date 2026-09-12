import logger from "../config/logger.js";
import AppError from "../errors/AppError.js";
import { translateDBError } from "../errors/databaseError.js";

function errorMiddleware(err, req, res, next) {

    const translatedError = translateDBError(err);
    if(translatedError) {
        return res.status(translatedError.statusCode).json({
            message: translatedError.message
        });
    }

    if(err instanceof AppError){
        return res.status(err.statusCode).json({
            message: err.message
        })
    }

    logger.error({
            method: req.method,
            url: req.originalUrl,
            message: err.message,
            stack: err.stack
        },
        "Unhandled error"
    );

    return res.status(500).json({
        message: "Internal Server Error"
    })
}

export default errorMiddleware;