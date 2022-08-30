import express from "express";
import "express-async-errors"; 
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.listen(process.env.PORT, () => {
    console.log(`Server on! na porta ${process.env.PORT}`);
});