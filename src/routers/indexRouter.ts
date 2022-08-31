import { Router } from "express";

import cardsRouter from "./cardsRouter.js";
import transactionRouter from "./transactionRouter.js";

const indexRouter = Router();

indexRouter.use([cardsRouter,transactionRouter]);

export default indexRouter;