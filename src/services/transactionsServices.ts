import * as cardRepository from "../repositories/cardRepository.js"
import * as companyRepository from "../repositories/companyRepository.js"
import * as rechargeRepository from "../repositories/rechargeRepository.js"

import { isExpired } from "./cardsServices.js";

export default async function recharger(apiKey: string, rechargeInfo: any) {
    const possibleCompany = await companyRepository.findByApiKey(apiKey);
    if(!possibleCompany){
        throw { name: "Not Found", message: "There are no companies with this api key."}
    }
    const possibleCard = await cardRepository.findById(rechargeInfo.cardId);
    if(!possibleCard){
        throw { name: "Not Found", message: "There are no cards with this id."}
    }
    if(possibleCard.password === null){
        throw { name: "Not Active", message: "Activate this card first."};
    }
    const expired = isExpired(possibleCard.expirationDate)
    if(expired){
        throw { name: "Expired", message: "This card has expired get a new one."};
    }
    await rechargeRepository.insert(rechargeInfo);
}

