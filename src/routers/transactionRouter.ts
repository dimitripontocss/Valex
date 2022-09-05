import { Router } from "express";

import { apiKeyValidator } from "../middlewares/apiKeyValidator.js";
import { schemasMiddleware } from "../middlewares/schemasMiddleware.js";
import { rechargeSchema,paymentSchema,onlinePaymentSchema } from "../schemas/transactionsSchemas.js";
import { rechargeController,paymentController,onlinePaymentController } from "../controllers/transactionsController.js";

const transactionRouter = Router();

transactionRouter.post("/recharge",apiKeyValidator, schemasMiddleware(rechargeSchema), rechargeController);
transactionRouter.post("/payment", schemasMiddleware(paymentSchema), paymentController);
transactionRouter.post("/payment/online", schemasMiddleware(onlinePaymentSchema), onlinePaymentController);

export default transactionRouter;