import { Request, Response } from "express";
import recharger from "../services/transactionsServices.js";

export async function rechargeController(req: Request, res: Response) {
    const apiKey = (req.headers['x-api-key']) as string;
    const rechargeInfo = req.body;
    await recharger(apiKey, rechargeInfo);
    res.sendStatus(200);
}