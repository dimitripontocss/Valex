import { Router } from "express";

import { apiKeyValidator } from "../middlewares/apiKeyValidator.js";
import { schemasMiddleware } from "../middlewares/schemasMiddleware.js";
import { rechargeSchema,paymentSchema,onlinePaymentSchema } from "../schemas/transactionsSchemas.js";
import { rechargeController,paymentController,onlinePaymentController } from "../controllers/transactionsController.js";

const transactionRouter = Router();

transactionRouter.post("/recharge",apiKeyValidator, schemasMiddleware(rechargeSchema), rechargeController);
//Header
//Com x-api-key
//Body
// {
//     "cardId": 2,
//     "amount": 200
// }

transactionRouter.post("/payment", schemasMiddleware(paymentSchema), paymentController);
//Body
// {
//   "cardId": 2,
//   "password": "1234",
//   "businessId": 3,
//   "amount": 50
// }

transactionRouter.post("/payment/online", schemasMiddleware(onlinePaymentSchema), onlinePaymentController);
//Body
// {
//     "number": "5185-4853-9016-1072",
//     "cardholderName": "CICLANA M MADEIRA",
//     "expirationDate": "09/27",
//     "securityCode": "064",
//     "businessId": 3,
//     "amount": 50
// }

export default transactionRouter;