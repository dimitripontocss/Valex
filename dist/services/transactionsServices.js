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
import bcrypt from 'bcrypt';
import * as cardRepository from "../repositories/cardRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as businessRepository from "../repositories/businessRepository.js";
import { isExpired } from "./cardsServices.js";
export function recharger(apiKey, rechargeInfo) {
    return __awaiter(this, void 0, void 0, function () {
        var possibleCompany, possibleCard;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, companyRepository.findByApiKey(apiKey)];
                case 1:
                    possibleCompany = _a.sent();
                    if (!possibleCompany) {
                        throw { name: "Not Found", message: "There are no companies with this api key." };
                    }
                    return [4 /*yield*/, cardRepository.findById(rechargeInfo.cardId)];
                case 2:
                    possibleCard = _a.sent();
                    if (!possibleCard) {
                        throw { name: "Not Found", message: "There are no cards with this id." };
                    }
                    cardValidator(possibleCard);
                    return [4 /*yield*/, rechargeRepository.insert(rechargeInfo)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
export function payment(paymentInfo) {
    return __awaiter(this, void 0, void 0, function () {
        var possibleBusiness, possibleCard, passwordValidate, balance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, businessRepository.findById(paymentInfo.businessId)];
                case 1:
                    possibleBusiness = _a.sent();
                    if (!possibleBusiness) {
                        throw { name: "Not Found", message: "There are no cards with this id." };
                    }
                    return [4 /*yield*/, cardRepository.findById(paymentInfo.cardId)];
                case 2:
                    possibleCard = _a.sent();
                    if (!possibleCard) {
                        throw { name: "Not Found", message: "There are no cards with this id." };
                    }
                    if (possibleBusiness.type !== possibleCard.type) {
                        throw { name: "Diferent Types", message: "This bussines type is diferent from your card type, try again with a diferent card." };
                    }
                    cardValidator(possibleCard);
                    passwordValidate = bcrypt.compareSync(paymentInfo.password, possibleCard.password);
                    if (!passwordValidate) {
                        throw { name: "Wrong Password", message: "Wrong password." };
                    }
                    return [4 /*yield*/, getCardBalance(possibleCard.id)];
                case 3:
                    balance = _a.sent();
                    if (balance - paymentInfo.amount < 0) {
                        throw { name: "Insufficient Funds", message: "Insufficient funds to do this payment." };
                    }
                    return [4 /*yield*/, paymentRepository.insert(paymentInfo)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function cardValidator(card) {
    if (card.isBlocked) {
        throw { name: "Blocked", message: "This card has been blocked." };
    }
    if (card.password === null) {
        throw { name: "Not Active", message: "Activate this card first." };
    }
    var expired = isExpired(card.expirationDate);
    if (expired) {
        throw { name: "Expired", message: "This card has expired get a new one." };
    }
}
export function getCardBalance(cardId) {
    return __awaiter(this, void 0, void 0, function () {
        var recharges, payments, rechargesAmount, paymentsAmount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rechargeRepository.findByCardId(cardId)];
                case 1:
                    recharges = _a.sent();
                    return [4 /*yield*/, paymentRepository.findByCardId(cardId)];
                case 2:
                    payments = _a.sent();
                    rechargesAmount = 0;
                    paymentsAmount = 0;
                    recharges.map(function (recharge) {
                        rechargesAmount += recharge.amount;
                    });
                    payments.map(function (payment) {
                        paymentsAmount += payment.amount;
                    });
                    return [2 /*return*/, rechargesAmount - paymentsAmount];
            }
        });
    });
}
