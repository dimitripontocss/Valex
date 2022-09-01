import { Request, Response } from "express";

import * as transactions from "../services/transactionsServices.js";

export async function rechargeController(req: Request, res: Response) {
    const apiKey = (req.headers['x-api-key']) as string;
    const rechargeInfo = req.body;
    await transactions.recharger(apiKey, rechargeInfo);
    res.status(200).send("Recharge done successfuly.");
}

export async function paymentController(req: Request, res: Response) {
    const paymentInfo = req.body;
    await transactions.payment(paymentInfo);
    res.status(200).send("Payment done successfuly.");
}