import { Request, Response } from "express";

import * as cardServices from "../services/cardsServices.js"


export async function createNewCard(req: Request, res: Response) {
    const apiKey = (req.headers['x-api-key']) as string;
    const cardInfo = req.body;
    const result = await cardServices.createNewCard(apiKey,cardInfo);
    res.status(200).send(result);
}

export async function activateNewCard(req: Request, res: Response) {
    const cardInfo = req.body;
    await cardServices.activateNewCard(cardInfo);
    res.status(200).send("Card activated!");
}

export async function lockOrUnlock(req: Request, res: Response) {
    const cardInfo = req.body;
    const message = await cardServices.lockOrUnlock(cardInfo);
    res.status(200).send(message);
}