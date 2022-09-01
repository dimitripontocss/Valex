import joi from "joi";
export var rechargeSchema = joi.object({
    cardId: joi.number().required(),
    amount: joi.number().required().min(1)
});
export var paymentSchema = joi.object({
    cardId: joi.number().required(),
    password: joi.string().length(4),
    businessId: joi.number().required(),
    amount: joi.number().required().min(1)
});
