*Criação de cartão:* 
ROTA: POST -> "https://valexback.herokuapp.com/card" 
Header
Com x-api-key
Body
{
    "type": "",
    "employeeId": NUMBER
}


*Ativação de cartão:* 
ROTA: POST -> "https://valexback.herokuapp.com/activate-card" 
Body
{
    "cardId": NUMBER,
    "securityCode": "",
    "password": ""
}


*Bloqueio ou desbloqueio de cartão:* 
ROTA: POST -> "https://valexback.herokuapp.com/lock-unlock" 
Body
{
    "cardId": NUMBER,
    "password": ""
}


*Pegar o status do cartão:* 
ROTA: GET -> "https://valexback.herokuapp.com/card-status/cardId" 
Mandar Params com cardId


*Recarga de cartão:* 
ROTA: POST -> "https://valexback.herokuapp.com/recharge" 
Header
Com x-api-key
Body
{
    "cardId": NUMBER,
    "amount": NUMBER
}


*Pagamentos com o cartão:* 
ROTA: POST -> "https://valexback.herokuapp.com/payment" 
Body
{
    "cardId": NUMBER,
    "password": "",
    "businessId": NUMBER,
    "amount": NUMBER
}


*Pagamentos online com o cartão:* 
ROTA: POST -> "https://valexback.herokuapp.com/payment/online" 
Body
{
    "number": "",
    "cardholderName": "",
    "expirationDate": "",
    "securityCode": "",
    "businessId": NUMBER,
    "amount": NUMBER
}