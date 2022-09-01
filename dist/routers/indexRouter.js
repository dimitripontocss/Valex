import { Router } from "express";
import cardsRouter from "./cardsRouter.js";
import transactionRouter from "./transactionRouter.js";
var indexRouter = Router();
indexRouter.use([cardsRouter, transactionRouter]);
export default indexRouter;
