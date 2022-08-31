import { Router } from "express";

import { newCardValidator } from "../middlewares/newCardValidator.js";
import { createNewCard } from "../controllers/cardsController.js";

const cardsRouter = Router();

cardsRouter.post("/card",newCardValidator, createNewCard);

export default cardsRouter;