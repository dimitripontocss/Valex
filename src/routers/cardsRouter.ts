import { Router } from "express";

import { newCardValidator } from "../middlewares/newCardValidator.js";
import { createNewCard,activateNewCard,lockOrUnlock } from "../controllers/cardsController.js";
import { schemasMiddleware } from "../middlewares/schemasMiddleware.js";
import { newCardSchema,validateNewCardSchema,lockSchema } from "../schemas/cardSchemas.js";

const cardsRouter = Router();

cardsRouter.post("/card",newCardValidator, schemasMiddleware(newCardSchema), createNewCard);
cardsRouter.post("/activate-card", schemasMiddleware(validateNewCardSchema), activateNewCard);
cardsRouter.post("/lock-unlock", schemasMiddleware(lockSchema), lockOrUnlock);

export default cardsRouter;