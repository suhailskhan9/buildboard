import AppError from "./AppError.js";

export function translateDBError(err) {
    if(err.code === "23505") {
        switch (err.constraint) {
            case "project_members_project_user_unique":
                return new AppError(409, "User is already a member of this project");

            case "project_members_one_owner":
                return new AppError(409, "Project already has an owner");

            case "users_email_key":
                return new AppError(409, "Email is already registered");
            
            case "users_username_key":
                return new AppError(409, "Username is already taken");
            
            default:
                return new AppError(409, "Resource already exists");
        }
    }

    if(err.code === "23503") {
        return new AppError(409, "Referenced resource does not exist or cannot be modified")
    }

    if(err.code === "23514") {
        return new AppError(400, "Provided value violates a data constraint");
    }

    if(err.code === "23502") {
        return new AppError(400, "Required field is missing");
    }

    return null;
}