import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import Cryptr from 'cryptr';
import bcrypt from 'bcrypt';

import * as cardRepository from "../repositories/cardRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import { getCardBalance } from './transactionsServices.js';

export async function activateNewCard(cardInfo: any){
    const possibleCard = await cardRepository.findById(cardInfo.cardId);
    if(!possibleCard){
        throw { name: "Not Found", message: "There are no cards with this id."}
    }
    if(possibleCard.password !== null){
        throw { name: "Not Allowed", message: "Card already activated."}
    }

    const cryptr = new Cryptr(process.env.CRYPTR_KEY);
    const cardCVC = cryptr.decrypt(possibleCard.securityCode);
    if(cardCVC !== cardInfo.securityCode){
        throw { name: "Wrong CVC", message: "The CVC informed is wrong."}
    }
    const cryptedPassword = bcrypt.hashSync(cardInfo.password, 10);
    
    await cardRepository.update(cardInfo.cardId, {password: cryptedPassword})

    return
}

export async function lockOrUnlock(cardInfo: any){
    const possibleCard = await cardRepository.findById(cardInfo.cardId);
    if(!possibleCard){
        throw { name: "Not Found", message: "There are no cards with this id."};
    }
    
    const passwordValidate = bcrypt.compareSync(cardInfo.password, possibleCard.password);
		if(!passwordValidate){
            throw { name: "Wrong Password", message: "Wrong password."};
    }

    const expired = isExpired(possibleCard.expirationDate)
    if(expired){
        throw { name: "Not Found", message: "There are no cards with this id."};
    }

    if(possibleCard.isBlocked){
        await cardRepository.update(possibleCard.id, {isBlocked: false})
        return "Card unlocked!"
    }else{
        await cardRepository.update(possibleCard.id, {isBlocked: true});
        return "Card locked!"
    }
}

export async function createNewCard(apiKey: string, cardInfo: any){
    const possibleCompany = await companyRepository.findByApiKey(apiKey);
    if(!possibleCompany){
        throw { name: "Not Found", message: "There are no companies with this api key."}
    }
    const possibleEmployee = await employeeRepository.findById(cardInfo.employeeId);
    if(!possibleEmployee){
        throw { name: "Not Found", message: "There are no employees with this id."}
    }
    
    const alreadyExistCard = await cardRepository.findByTypeAndEmployeeId(cardInfo.type,cardInfo.employeeId)
    if(alreadyExistCard){
        throw { name: "Already Exists", message: "There is already a card of this type for this employee."}
    }

    const name = nameChanger(possibleEmployee.fullName);
    const {number, securityCode} = fakeInfoGenerator();

    const cryptr = new Cryptr(process.env.CRYPTR_KEY);
    const encryptedCVV = cryptr.encrypt(securityCode);
    
    const expirationDate = getExpirationDate();
    const cardData = dataGenerator(cardInfo.employeeId, number, name, encryptedCVV, expirationDate, cardInfo.type);
    
    await cardRepository.insert(cardData);

    return{
        employeeId: cardInfo.employeeId,
        name,
        number,
        securityCode,
        expirationDate,
        type: cardInfo.type
    }
}

export async function getCardStatus(cardId: number) {
    const possibleCard = await cardRepository.findById(cardId);
    if(!possibleCard){
        throw { name: "Not Found", message: "There are no cards with this id."}
    }
    const balance = await getCardBalance(cardId);
    const transactions = await getCardTransactions(cardId);

    return {balance, ...transactions};
}

export async function getCardTransactions(cardId:number){
    const recharges = await rechargeRepository.findByCardId(cardId);
    const payments = await paymentRepository.findByCardId(cardId);
    
    return {transactions: payments, recharges};
}

function dataGenerator(employeeId: number, number:string, cardholderName: string, securityCode:string, expirationDate:string,type:cardRepository.TransactionTypes){
    return {
        employeeId ,
        number,
        cardholderName,
        securityCode,
        expirationDate,
        password: null,
        isVirtual: false,
        originalCardId:null,
        isBlocked:false,
        type,
    }
}

function getExpirationDate():string{
    const newDate = dayjs().add(5,'years').format('MM/YY') as string;
    return newDate;
}

function nameChanger(name:string):string{
    const arrName = name.split(" ");
    let newNameArr = [];
    newNameArr.push(arrName[0].toUpperCase());
    for(let i=1;i<arrName.length-1;i++){
        if(arrName[i].length >= 3){
            newNameArr.push(arrName[i][0].toUpperCase())
        }
    }
    newNameArr.push(arrName[arrName.length-1].toUpperCase());
    const newName = newNameArr.join(" ");
    return newName;
}

function fakeInfoGenerator(){
    return{
        number: faker.finance.creditCardNumber(),
        securityCode: faker.finance.creditCardCVV()
    }
}

export function isExpired(expirationDate:any):boolean{
    const date = dayjs("01/"+expirationDate);
    const today = dayjs();
    const diff = date.diff(today);
    if(diff > 0) return false
    return true
}