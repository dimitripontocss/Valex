import { Router } from "express";

import { apiKeyValidator } from "../middlewares/apiKeyValidator.js";
import { schemasMiddleware } from "../middlewares/schemasMiddleware.js";
import { rechargeSchema } from "../schemas/transactionsSchemas.js";
import { rechargeController } from "../controllers/transactionsController.js";

const transactionRouter = Router();

transactionRouter.post("/recharge",apiKeyValidator, schemasMiddleware(rechargeSchema),rechargeController);


export default transactionRouter;