import { Router } from "express";

import cardsRouter from "./cardsRouter.js";

const indexRouter = Router();

indexRouter.use([cardsRouter]);

export default indexRouter;