export var schemasMiddleware = function (schema) {
    return function (req, res, next) {
        var validation = schema.validate(req.body, { abortEarly: false });
        if (validation.error) {
            console.log(validation.error.details);
            res.sendStatus(422);
            return;
        }
        next();
    };
};
