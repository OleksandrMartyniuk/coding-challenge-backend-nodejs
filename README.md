# Stolen Bike Cases - JOIN Coding Challenge - Backend (Node.js)
![JOIN Stolen Bike Cases](https://github.com/join-com/coding-challenge-backend-nodejs/raw/master/illustration.png)

## Context
Stolen bikes are a typical problem in Berlin. The Police want to be more efficient in resolving stolen bike cases. They decided to build a software that can automate their processes — the software that you're going to develop. 

## Product Requirements
- [x] Bike owners can report a stolen bike.
- [x] A bike can have multiple characteristics: license number, color, type, full name of the owner, date, and description of the theft.
- [x] Police have multiple departments that are responsible for stolen bikes. 
- [x] A department can have some amount of police officers who can work on stolen bike cases.
- [x] The Police can scale their number of departments, and can increase the number of police officers per department.
- [x] Each police officer should be able to search bikes by different characteristics in a database and see which department is responsible for a stolen bike case.
- [x] New stolen bike cases should be automatically assigned to any free police officer in any department.  
- [x] A police officer can only handle one stolen bike case at a time. 
- [x] When the Police find a bike, the case is marked as resolved and the responsible police officer becomes available to take a new stolen bike case. 
- [x] The system should be able to assign unassigned stolen bike cases automatically when a police officer becomes available.

## Built With
- Node.js
- Express
- Sequelize(MySQL)
- Mocha, Chai integration tests + NYC coverage
- Typescript

Hosted with Heroku: https://find-my-bike.herokuapp.com/

## Prerequisites
- Docker, docker-compose

## Running the tests
Running tests made simple with docker-compose, just run 

```
$ docker-compose build
$ docker-compose up
```
Test coverage report will be generated in 'coverage' folder.

OR
```
$ npm run test
$ npm run test:coverage
```

## Environment Variables
- LOGGING - logging strategy(only console supported so far)
- PORT - api port
- DB_USER
- DB_PASSWORD
- DB_PORT
- DB_HOST
- DB_DATABASE
- FORCE_SYNC - Warning! This enables force sync of database schema, all data will be lost.

## Running the API
```
$ npm run start
or
$ npm run dev
```