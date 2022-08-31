import { Router } from "express";

import { newCardValidator } from "../middlewares/newCardValidator.js";
import { createNewCard,activateNewCard } from "../controllers/cardsController.js";
import { schemasMiddleware } from "../middlewares/schemasMiddleware.js";
import { newCardSchema,validateNewCardSchema } from "../schemas/cardSchemas.js";

const cardsRouter = Router();

cardsRouter.post("/card",newCardValidator, schemasMiddleware(newCardSchema), createNewCard);
cardsRouter.post("/activate-card", schemasMiddleware(validateNewCardSchema), activateNewCard);

export default cardsRouter;