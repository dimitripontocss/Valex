import joi from "joi";


export const rechargeSchema = joi.object({
    cardId: joi.number().required(),
    amount: joi.number().required().min(1)
});

export const paymentSchema = joi.object({
    cardId: joi.number().required(),
    password: joi.string().required().length(4),
    businessId: joi.number().required(),
    amount: joi.number().required().min(1)
});

export const onlinePaymentSchema = joi.object({
    number: joi.string().required(),
    cardholderName: joi.string().required(),
    expirationDate: joi.string().required().length(5),
    securityCode: joi.string().required().length(3),
    businessId: joi.number().required(),
    amount: joi.number().required().min(1)
});