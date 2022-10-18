# <p align = "center"> Valex </p>

<p align="center">
   <img style="width:300px" src="https://notion-emojis.s3-us-west-2.amazonaws.com/prod/svg-twitter/1f4b0.svg"/>
</p>

<p align = "center">
   <img src="https://img.shields.io/badge/author-dimitripontocss-4dae71?style=flat-square" />
   <img src="https://img.shields.io/github/languages/count/dimitripontocss/projeto18-valex?color=4dae71&style=flat-square" />
</p>

## :clipboard: Description

This is a Api made for companies who are looking to implement a type of card that can be used as a meal ticket or to buy other things. With this server you can create a card with 5 diferent types, activate them, recharge and control where your employees can and cannot buy. To have access to this app contact us so we can register your access "x-api-key".

You can access our deploy at: https://valexback.herokuapp.com

---

## :computer: Tecnologies used

- REST APIs
- Node.js
- TypeScript
- Postgres

---

## :rocket: Routes

```yml
POST /card
    - Route used to create a new card
    - headers: {"x-api-key": loremipsum}
    - body: {
        "type": "loremipsum",
        "employeeId": NUMBER
        }
```

```yml
POST /activate-card
    - Route used to activate a card
    - headers: {}
    - body: {
        "cardId": NUMBER,
        "securityCode": "loremipsum",
        "password": "loremipsum"
        }
```

```yml
POST /lock-unlock
    - Route used to lock or unlock a card
    - headers: {},
    - body : {
        "cardId": NUMBER,
        "password": "loremipsum"
        }
```

```yml
GET /card-status/${cardId}
    - Route used to see the status of a card
    - headers: {}
    - body : {}
```

```yml
POST /recharge
    - Route used to recharge a card
    - headers: {"x-api-key": loremipsum}
    - body: {
        "cardId": NUMBER,
        "amount": NUMBER
        }
```

```yml
POST /payment
    - Route used to make a payment with a card
    - headers: {}
    - body: {
        "cardId": NUMBER,
        "password": "loremipsum",
        "businessId": NUMBER,
        "amount": NUMBER
        }
```

```yml
POST /payment/online
    - Route used to make an online payment with a card
    - headers: {}
    - body: {
        "number": "loremipsum",
        "cardholderName": "loremipsum",
        "expirationDate": "loremipsum",
        "securityCode": "loremipsum",
        "businessId": NUMBER,
        "amount": NUMBER
        }
```

---

## 🏁 Running the application

This project was made with Node.Js, so in order to run it at your machine you gotta have a stable version of Node.Js and NPM installed.

First, clone this directory:

```
git clone https://github.com/dimitripontocss/projeto18-valex
```

After, inside the directory, run this command to install the dependencies:

```
npm install
```

After its done run this command to build the aplication:

```
npm build
```

And then this command to run the server:

```
npm start
```
