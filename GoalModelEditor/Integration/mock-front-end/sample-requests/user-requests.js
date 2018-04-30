/* Simulation of requests associated with:
 *      (1) User registration
 *      (2) User login
 *      (3) Fetching User Profile
 */

const request = require("request");
const BACKEND_SERVER_URL = "http://localhost:3000"
const USER_ROUTE = "/users"


/* (1) User Registration */
// the JSON for user registration
var registration_JSON = {
    type: "REGISTER",
    username: "VPutin",
    password: "qwerty",
    firstname: "Vladimir",
    lastname: "Putin",
    email: "putin@kgb.ru"
}

request.post(
    
    // formulate and send the request
    { url: BACKEND_SERVER_URL+USER_ROUTE
    , json: true
    , body: registration_JSON
    }
    
    // callback function on response
    , function (err, res, body) {
        if (err) {
            console.log(err);
        }
        console.log(body);
    }
);


/* (2) User Login */
// the JSON for user login
var login_JSON = {
    type: "LOGIN",
    username: "VPutin",
    password: "qwerty"
}

request.get(

    // formulate and send requst
    { url: BACKEND_SERVER_URL+USER_ROUTE
    , json: true
    , body: registration_JSON
    }

    // callback function on response
    , function (err, res, body) {
        if (err) {
            console.log(err);
        }
        console.log(body);
    }
);


/* (3) Fetch User Profile */
