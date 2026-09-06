export default function validate(schema, source="body") {
    return function (req, res, next) {
        const result = schema.safeParse(req[source]);

        if(!result.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: result.error.issues
            })
        }

        if(source === "query"){
            req.validatedQuery = result.data;
        } else{
            req[source] = result.data;
        }
        next();
    }
}