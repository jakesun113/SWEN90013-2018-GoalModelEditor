'use strict'
/* integration Layer
 *
 * Provides an interface between the front-end and back-end Node.js servers.
 * It does this by providing a set of functions to the front-end that:
 *    (1) Building HTTPS requests out of arguments received from the
 *        front-end;
 *    (2) Sending these requests to the back-end;
 *    (3) Parsing HTTPS responses from the back-end into a format
 *        easily consumed by the front-end; and
 *    (4) Returning these to the front-end.
 *
 * Part of the responsibility of this module is to make requests to
 * and from the back-end appear synchronous to the front-end. That is,
 * when the front-end uses functions from this module, control flow
 * will be blocked until it returns.
 *
 * UPDATE: practically all the research I've done has indicate that
 * attempting to force Node.js to act ascynchronously is really bad
 * style (becuse Node is single-threaded, it can cause deadlock). Instead,
 * we should actually return a callback.
 */

// import request module: https://github.com/request/request
const https = require("https");

// other parameters
const TIMEOUT = 5000; // milliseconds for timeout

// error types
const ERR_TIMEOUT = "ETIMEDOUT";

// response codes
const CODE_SUCCESS_200 = 200;
const CODE_SUCCESS_201 = 201;
const CODE_FAILURE_504 = 504;
const CODE_FAILURE_409 = 409;

// back-end URL
const BACK_END_URL = "https://localhost:3000";

// back-end routes
const USER_ROUTE = "/users";
const PROJECT_ROUTE = "/projects";

/* Register a new user.
 *
 * Input:
 * - username: String
 * - password: String
 * Output:
 * - registered: Boolean
 */
function register(username, password) {

    // form and send to back-end
    request(
        { method: "POST"
            , timeout: ERR_TIMEOUT
            , url: BACK_END_URI+USER_ROUTE
            , body: "username="+username+"&password="+password
        },

        function(error, response, body) {

            // if back-end error occurs, return error
            if (err == ERR_TIMEOUT) {
                console.log(err);
                return CODE_FAILURE_504;
            }

            // if user exists, return error
            if (response.statusCode == CODE_FAILURE_409) {
                return CODE_FAILURE_409;
            }

            // if user registration successful, return success
            if (response.statusCode == CODE_SUCCESS_201) {
                return CODE_SUCCESS_201;
            }
        });
}

/* Login.
 *
 * Input:
 * - username: String
 * - password: String
 * Output:
 * - token: String
 */
function login(username, password) {

    // form and send to back-end

    // if back-end times out, return error

    // if invalid uername/password, return error

    // if login successful, return token

}

/* Retrieve User Profile.
 *
 * Input:
 * - token: String
 * Output:
 * - filesystem: JSON
 */
function fetchUserProfile(token) {}


/* SCAFFOLD FUNCTIONS - to be implementaed as required*/

function editUserProfile(token, password, firstname, lastname, email) {}

function fetchFileSystem(token) {}

function createProject(req, res, next) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    var options = {
        host: 'localhost',
        port: 3030,
        path: '/user/myfile/createfile',
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        }
    };
    console.log(req.body);
    var fileinfo;
    var request = https.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('2');
            fileinfo = chunk;
            req.specialData = fileinfo;
            console.log(req.specialData);
            next();
        });
    });
    request.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    request.write(req.body);
    request.end();
}
function editProject(token, name) {} // change project name
function deleteProject(token, name) {}

function createGoalModel(token, name) {}
function fetchGoalModel(token, name) {}
function editGoalModel(token, name, file) {}
function deleteGoalModel(token, name) {}

function shareGoalModel(token, name, users, type) {}


module.exports.createProject = createProject;