import { Router } from "express";
import { apiKeyValidator } from "../middlewares/apiKeyValidator.js";
import { schemasMiddleware } from "../middlewares/schemasMiddleware.js";
import { rechargeSchema, paymentSchema } from "../schemas/transactionsSchemas.js";
import { rechargeController, paymentController } from "../controllers/transactionsController.js";
var transactionRouter = Router();
transactionRouter.post("/recharge", apiKeyValidator, schemasMiddleware(rechargeSchema), rechargeController);
transactionRouter.post("/payment", schemasMiddleware(paymentSchema), paymentController);
export default transactionRouter;
