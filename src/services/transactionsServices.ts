import bcrypt from 'bcrypt';

import * as cardRepository from "../repositories/cardRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as businessRepository from "../repositories/businessRepository.js";

import { isExpired } from "./cardsServices.js";

export async function recharger(apiKey: string, rechargeInfo: any) {
    const possibleCompany = await companyRepository.findByApiKey(apiKey);
    if(!possibleCompany){
        throw { name: "Not Found", message: "There are no companies with this api key."}
    }
    const possibleCard = await cardRepository.findById(rechargeInfo.cardId);
    if(!possibleCard){
        throw { name: "Not Found", message: "There are no cards with this id."}
    }
    cardValidator(possibleCard);

    await rechargeRepository.insert(rechargeInfo);
}

export async function payment(paymentInfo: any) {
    const possibleBusiness = await businessRepository.findById(paymentInfo.businessId);
    if(!possibleBusiness){
        throw { name: "Not Found", message: "There are no cards with this id."}
    }
    const possibleCard = await cardRepository.findById(paymentInfo.cardId);
    if(!possibleCard){
        throw { name: "Not Found", message: "There are no cards with this id."}
    }
    if(possibleBusiness.type !== possibleCard.type){
        throw { name: "Diferent Types", message: "This bussines type is diferent from your card type, try again with a diferent card."}
    }
    cardValidator(possibleCard);
    const passwordValidate = bcrypt.compareSync(paymentInfo.password, possibleCard.password);
		if(!passwordValidate){
            throw { name: "Wrong Password", message: "Wrong password."};
    }
    const balance = await getCardBalance(possibleCard.id);
    if(balance - paymentInfo.amount < 0){
        throw { name: "Insufficient Funds", message: "Insufficient funds to do this payment."};
    }

    await paymentRepository.insert(paymentInfo);
}

function cardValidator(card: any){
    if(card.isBlocked){
        throw { name: "Blocked", message: "This card has been blocked."};
    }
    if(card.password === null){
        throw { name: "Not Active", message: "Activate this card first."};
    }
    const expired = isExpired(card.expirationDate)
    if(expired){
        throw { name: "Expired", message: "This card has expired get a new one."};
    }
}

export async function getCardBalance(cardId:number){
    const recharges = await rechargeRepository.findByCardId(cardId);
    const payments = await paymentRepository.findByCardId(cardId);
    let rechargesAmount: number = 0
    let paymentsAmount: number = 0
    recharges.map((recharge)=>{
        rechargesAmount += recharge.amount
    })
    payments.map((payment)=>{
        paymentsAmount += payment.amount
    })
    return rechargesAmount - paymentsAmount;
}