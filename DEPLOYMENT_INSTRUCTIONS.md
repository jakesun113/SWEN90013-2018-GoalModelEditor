# Motivational Modeller, Deployment Instructions

## Setup Instructions

1. Install Dependencies
2. Import Database
3. Configure Database Connection
4. Run the Server

## 1. Install Dependencies

Install Node.js and npm:
* Nodejs v10.10.0+ (https://nodejs.org/en/download/)
* npm (https://docs.npmjs.com/cli/install)

Install the npm packages:
* cd into `/GoalModelEditor/BackEnd/`
* Install node packages by executing `npm install`

(If you are running the service on the linux system, you need to add a launch flag(running without sandbox) for puppeteer.

Just go to the GoalModelEditor/BackEnd/node_modules/convert-svg-core/src/Converter.js, and modify the
puppeteer.launch caller in line 273 to something like

"this[_browser] = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});")

## 2. Import Database

## 3. Configure Database Connection
This assumes that you have already set up a MySQL database on the host server.
* Open `/GoalModelEditor/Database/DBModule/dbConfig.js`
* Fill in the `host`, `user`, `password`, and `database` fields with the details of your database.

## 4. Run the Server
* cd into `GoalModelEditor/Backend/`
* Run the node server by executing `npm run start` (or `node server.js`; or `nodejs server.js` for certain Linux distributions of Nodejs)
* This should start the server on `https://localhost:8080`; note, `https`, not `http`.
