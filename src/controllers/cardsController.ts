import { Request, Response } from "express";

import * as cardServices from "../services/cardsServices.js"


export async function createNewCard(req: Request, res: Response) {
    const apiKey = (req.headers['x-api-key']) as string;
    const cardInfo = req.body;
    const result = await cardServices.createNewCard(apiKey,cardInfo);
    res.status(200).send(result);
}
