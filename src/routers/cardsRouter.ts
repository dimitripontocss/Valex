import { Router } from "express";

import { apiKeyValidator } from "../middlewares/apiKeyValidator.js";
import { createNewCard,activateNewCard,lockOrUnlock, getCardStatus } from "../controllers/cardsController.js";
import { schemasMiddleware } from "../middlewares/schemasMiddleware.js";
import { newCardSchema,validateNewCardSchema,lockSchema } from "../schemas/cardSchemas.js";

const cardsRouter = Router();

cardsRouter.post("/card",apiKeyValidator, schemasMiddleware(newCardSchema), createNewCard);
cardsRouter.post("/activate-card", schemasMiddleware(validateNewCardSchema), activateNewCard);
cardsRouter.post("/lock-unlock", schemasMiddleware(lockSchema), lockOrUnlock);
cardsRouter.get("/card-status/:cardId", getCardStatus);


export default cardsRouter;