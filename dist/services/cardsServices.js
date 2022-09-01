var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
export function activateNewCard(cardInfo) {
    return __awaiter(this, void 0, void 0, function () {
        var possibleCard, cryptr, cardCVC, cryptedPassword;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cardRepository.findById(cardInfo.cardId)];
                case 1:
                    possibleCard = _a.sent();
                    if (!possibleCard) {
                        throw { name: "Not Found", message: "There are no cards with this id." };
                    }
                    if (possibleCard.password !== null) {
                        throw { name: "Not Allowed", message: "Card already activated." };
                    }
                    cryptr = new Cryptr(process.env.CRYPTR_KEY);
                    cardCVC = cryptr.decrypt(possibleCard.securityCode);
                    if (cardCVC !== cardInfo.securityCode) {
                        throw { name: "Wrong CVC", message: "The CVC informed is wrong." };
                    }
                    cryptedPassword = bcrypt.hashSync(cardInfo.password, 10);
                    return [4 /*yield*/, cardRepository.update(cardInfo.cardId, { password: cryptedPassword })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
export function lockOrUnlock(cardInfo) {
    return __awaiter(this, void 0, void 0, function () {
        var possibleCard, passwordValidate, expired;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cardRepository.findById(cardInfo.cardId)];
                case 1:
                    possibleCard = _a.sent();
                    if (!possibleCard) {
                        throw { name: "Not Found", message: "There are no cards with this id." };
                    }
                    passwordValidate = bcrypt.compareSync(cardInfo.password, possibleCard.password);
                    if (!passwordValidate) {
                        throw { name: "Wrong Password", message: "Wrong password." };
                    }
                    expired = isExpired(possibleCard.expirationDate);
                    if (expired) {
                        throw { name: "Not Found", message: "There are no cards with this id." };
                    }
                    if (!possibleCard.isBlocked) return [3 /*break*/, 3];
                    return [4 /*yield*/, cardRepository.update(possibleCard.id, { isBlocked: false })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, "Card unlocked!"];
                case 3: return [4 /*yield*/, cardRepository.update(possibleCard.id, { isBlocked: true })];
                case 4:
                    _a.sent();
                    return [2 /*return*/, "Card locked!"];
            }
        });
    });
}
export function createNewCard(apiKey, cardInfo) {
    return __awaiter(this, void 0, void 0, function () {
        var possibleCompany, possibleEmployee, alreadyExistCard, name, _a, number, securityCode, cryptr, encryptedCVV, expirationDate, cardData;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, companyRepository.findByApiKey(apiKey)];
                case 1:
                    possibleCompany = _b.sent();
                    if (!possibleCompany) {
                        throw { name: "Not Found", message: "There are no companies with this api key." };
                    }
                    return [4 /*yield*/, employeeRepository.findById(cardInfo.employeeId)];
                case 2:
                    possibleEmployee = _b.sent();
                    if (!possibleEmployee) {
                        throw { name: "Not Found", message: "There are no employees with this id." };
                    }
                    return [4 /*yield*/, cardRepository.findByTypeAndEmployeeId(cardInfo.type, cardInfo.employeeId)];
                case 3:
                    alreadyExistCard = _b.sent();
                    if (alreadyExistCard) {
                        throw { name: "Already Exists", message: "There is already a card of this type for this employee." };
                    }
                    name = nameChanger(possibleEmployee.fullName);
                    _a = fakeInfoGenerator(), number = _a.number, securityCode = _a.securityCode;
                    cryptr = new Cryptr(process.env.CRYPTR_KEY);
                    encryptedCVV = cryptr.encrypt(securityCode);
                    expirationDate = getExpirationDate();
                    cardData = dataGenerator(cardInfo.employeeId, number, name, encryptedCVV, expirationDate, cardInfo.type);
                    return [4 /*yield*/, cardRepository.insert(cardData)];
                case 4:
                    _b.sent();
                    return [2 /*return*/, {
                            employeeId: cardInfo.employeeId,
                            name: name,
                            number: number,
                            securityCode: securityCode,
                            expirationDate: expirationDate,
                            type: cardInfo.type
                        }];
            }
        });
    });
}
export function getCardStatus(cardId) {
    return __awaiter(this, void 0, void 0, function () {
        var possibleCard, balance, transactions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cardRepository.findById(cardId)];
                case 1:
                    possibleCard = _a.sent();
                    if (!possibleCard) {
                        throw { name: "Not Found", message: "There are no cards with this id." };
                    }
                    return [4 /*yield*/, getCardBalance(cardId)];
                case 2:
                    balance = _a.sent();
                    return [4 /*yield*/, getCardTransactions(cardId)];
                case 3:
                    transactions = _a.sent();
                    return [2 /*return*/, __assign({ balance: balance }, transactions)];
            }
        });
    });
}
export function getCardTransactions(cardId) {
    return __awaiter(this, void 0, void 0, function () {
        var recharges, transactions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rechargeRepository.findByCardId(cardId)];
                case 1:
                    recharges = _a.sent();
                    return [4 /*yield*/, paymentRepository.findByCardId(cardId)];
                case 2:
                    transactions = _a.sent();
                    return [2 /*return*/, { transactions: transactions, recharges: recharges }];
            }
        });
    });
}
function dataGenerator(employeeId, number, cardholderName, securityCode, expirationDate, type) {
    return {
        employeeId: employeeId,
        number: number,
        cardholderName: cardholderName,
        securityCode: securityCode,
        expirationDate: expirationDate,
        password: null,
        isVirtual: false,
        originalCardId: null,
        isBlocked: false,
        type: type
    };
}
function getExpirationDate() {
    var newDate = dayjs().add(5, 'years').format('MM/YY');
    return newDate;
}
function nameChanger(name) {
    var arrName = name.split(" ");
    var newNameArr = [];
    newNameArr.push(arrName[0].toUpperCase());
    for (var i = 1; i < arrName.length - 1; i++) {
        if (arrName[i].length >= 3) {
            newNameArr.push(arrName[i][0].toUpperCase());
        }
    }
    newNameArr.push(arrName[arrName.length - 1].toUpperCase());
    var newName = newNameArr.join(" ");
    return newName;
}
function fakeInfoGenerator() {
    return {
        number: faker.finance.creditCardNumber(),
        securityCode: faker.finance.creditCardCVV()
    };
}
export function isExpired(expirationDate) {
    var date = dayjs("01/" + expirationDate);
    var today = dayjs();
    var diff = date.diff(today);
    if (diff > 0)
        return false;
    return true;
}
