import { Request, Response, NextFunction } from "express";

export default function errorHandlingMiddleware(error:any, req:Request, res:Response, next:NextFunction) {
	if(error.name === "Not Found"){
		return res.status(404).send(error.message);
	}
	if(error.name === "Already Exists"){
		return res.status(400).send(error.message);
	}
	return res.sendStatus(500);
}


