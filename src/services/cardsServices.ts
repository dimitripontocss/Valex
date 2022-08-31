import { faker } from '@faker-js/faker';
import dayjs from 'dayjs'
import Cryptr from 'cryptr';
import bcrypt from 'bcrypt'

import * as cardRepository from "../repositories/cardRepository.js"
import * as companyRepository from "../repositories/companyRepository.js"
import * as employeeRepository from "../repositories/employeeRepository.js"

export async function activateNewCard(cardInfo: any){
    const possibleCard = await cardRepository.findById(cardInfo.cardId);
    if(!possibleCard){
        throw { name: "Not Found", message: "There is no cards with this id."}
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

export async function createNewCard(apiKey: string, cardInfo: any){
    const possibleCompany = await companyRepository.findByApiKey(apiKey);
    if(!possibleCompany){
        throw { name: "Not Found", message: "There is no companies with this api key."}
    }
    const possibleEmployee = await employeeRepository.findById(cardInfo.employeeId);
    if(!possibleEmployee){
        throw { name: "Not Found", message: "There is no employees with this id."}
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