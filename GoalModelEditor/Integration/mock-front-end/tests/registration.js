/* Simulation of requests associated with user registration.
 *
 */

const request = require("request");

const BACKEND_SERVER_URL = "http://localhost:3000"
const PROJECT_ROUTE = "/projects"

// (1) register new user
request.post(
    { url: BACKEND_SERVER_URL+USER_ROUTE
    , json: true
    , body: 
        { username: "VPutin"
        , password: "eye3>rusya"
        }
    }

    , function (err, res, body) {
        if (err) {
            console.log(err);
        }
        console.log(body);
    }
);
