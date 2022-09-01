import express from "express";
import "express-async-errors";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routers/indexRouter.js";
import errorHandlingMiddleware from "./middlewares/errorHandler.js";
dotenv.config();
var app = express();
app.use(cors());
app.use(express.json());
app.use(router);
app.use(errorHandlingMiddleware);
app.listen(process.env.PORT, function () {
    console.log("Server on! na porta ".concat(process.env.PORT));
});
