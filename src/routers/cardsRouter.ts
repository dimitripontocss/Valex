import { Router } from "express";

import { apiKeyValidator } from "../middlewares/apiKeyValidator.js";
import { createNewCard,activateNewCard,lockOrUnlock, getCardStatus, getEmployeeCards } from "../controllers/cardsController.js";
import { schemasMiddleware } from "../middlewares/schemasMiddleware.js";
import { newCardSchema,validateNewCardSchema,lockSchema } from "../schemas/cardSchemas.js";

const cardsRouter = Router();

cardsRouter.post("/card",apiKeyValidator, schemasMiddleware(newCardSchema), createNewCard);
//Header
//Com x-api-key
//Body
// {
//     "type": "restaurant",
//     "employeeId": 2
// }

cardsRouter.post("/activate-card", schemasMiddleware(validateNewCardSchema), activateNewCard);
// Body
// {
//     "cardId": 2,
//     "securityCode": "120",
//     "password": "1234"
// }

cardsRouter.post("/lock-unlock", schemasMiddleware(lockSchema), lockOrUnlock);
//Body
// {
//     "cardId": 2,
//     "password": "1234"
// }

cardsRouter.get("/card-status/:cardId", getCardStatus);
//https://valexback.herokuapp.com/card-status/2 Mandar Params com cardId

cardsRouter.get("/cards/:employeeId", getEmployeeCards);

export default cardsRouter