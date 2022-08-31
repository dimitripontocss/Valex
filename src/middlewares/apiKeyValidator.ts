import { Request, Response, NextFunction } from "express";

export async function apiKeyValidator(req: Request, res: Response, next:NextFunction) {
    const possibleApiKey = req.headers['x-api-key'];
    if(possibleApiKey === undefined){
        return res.status(404).send("The api key hasnt been sent.")
    }
    next();
}