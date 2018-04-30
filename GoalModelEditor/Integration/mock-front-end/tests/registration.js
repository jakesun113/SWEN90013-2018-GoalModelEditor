/* Simulation of requests associated with user registration.
 *
 */

const request = require("request");

const BACKEND_SERVER_URL = "http://localhost:3000"
const USER_ROUTE = "/users"

// (1) register new user

// the JSON for user registration
var payload = {
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
    , body: payload
    
    // callback function on response
    , function (err, res, body) {
        if (err) {
            console.log(err);
        }
        console.log(body);
    }
);
