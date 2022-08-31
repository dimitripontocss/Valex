import { Request, Response, NextFunction } from "express";

export async function newCardValidator(req: Request, res: Response, next:NextFunction) {
    const possibleApiKey = req.headers['x-api-key'];
    if(possibleApiKey === undefined){
        return res.status(404).send("The api key hasnt been sent.")
    }
    if(!isPossibleType(req.body.type)){
        return res.status(400).send("The type required doesnt exist.")
    }
    next();
}

function isPossibleType(type:string):boolean{
    const possibleTypes = ['groceries', 'restaurant', 'transport', 'education', 'health'];
    return possibleTypes.includes(type);
}