import joi from "joi";
export var newCardSchema = joi.object({
    employeeId: joi.number().required(),
    type: joi.string().required().valid('groceries', 'restaurant', 'transport', 'education', 'health')
});
export var validateNewCardSchema = joi.object({
    cardId: joi.number().required(),
    securityCode: joi.string().required().length(3),
    password: joi.string().required().length(4)
});
export var lockSchema = joi.object({
    cardId: joi.number().required(),
    password: joi.string().required().length(4)
});
