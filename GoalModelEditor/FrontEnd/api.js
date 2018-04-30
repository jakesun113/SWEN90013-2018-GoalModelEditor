'use strict'

const fs = require('fs');
var querystring = require("querystring");
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
const request = require("request");

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

//back-end Info for test
const BACK_END_TEST_IP = "192.168.1.1";
const BACK_END_TEST_PORT = "8080";
// back-end routes
const USER_ROUTE = "/users";
const PROJECT_ROUTE = "/projects";
const FETCH_USER_PROFILE = ""

/* Register a new user.
 *
 * Input:
 * - username: String
 * - password: String
 * Output:
 * - registered: Boolean
 */
function register(username, password, email, firstname, lastname) {

    //define headers
    var options = {
        host: BACK_END_TEST_IP,
        port: BACK_END_TEST_PORT,
        path: '/user_register',
        method: 'POST',
        timeout: TIMEOUT,
        headers: {
            "Content-Type": "application/json"
        }
    };
    //define request message body
    var body = querystring.stringify({
        username:username,
        password:password,
        email:email,
        firstname:firstname,
        lastname:lastname
    });

    var request = https.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log(chunk);
            next();
        });
        res.on('end', function(){
            console.log("response received")
        })
    });
    request.on('error', function(e) {
        //special return message for timeout
        if(e.message == ERR_TIMEOUT) {
            console.log(e.message);
            return CODE_FAILURE_504;
        }
        else{
            return e.message;
        }
        console.log('problem with request: ' + e.message);
    });
    request.write(body);
    request.end();

}

/* Login.
 *
 * Input:
 * - username: String
 * - password: String
 * Output:
 * - token: String
 */

function login(req, res, next) {

    // parse the body from req
    var payload = JSON.parse(JSON.stringify(req.body));

    // formulate and send request
    request.post(
        { url: "https://10.13.189.98:8080/user_login"
        , json: true
        , body: payload
        , cert: fs.readFileSync(__dirname + "/bin/certificate/file.crt")
        , securityOptions: "SSL_OP_NO_SSLv3"
        , rejectUnauthorized: false
        }

    // callback to front end server
        , function(err, res, body) {
            req.specialData = body;
            next();
        }
    );
} 

/*
function login(req, res, next) {
    console.log("aaaaaaaaa");

    var options = {
        host: "10.13.189.98",
        port: "8080",
        path: '/user_login',
        method: 'POST',
        timeout: TIMEOUT,
        headers: {
            "Content-Type": "application/json"
        },
        //secureProtocol: 'SSLv3_method',
        cert: fs.readFileSync(__dirname + "/bin/certificate/file.crt"),
        rejectUnauthorized: false // TODO: Remove when deploy
    };
    options.agent = new https.Agent(options);
    var body = JSON.stringify(req.body);
    var fileinfo;

    console.log("312");
    var request = https.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log(chunk);
            fileinfo = chunk;
            req.specialData = chunk;
            next();
        });
    });
    console.log("aaaaaa4324");

    request.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    request.write(body);
    request.end();

    // form and send to back-end

    // if back-end times out, return error

    // if invalid uername/password, return error

    // if login successful, return token

}
*/


/* Retrieve User Profile.
 *
 * Input:
 * - token: String
 * Output:
 * - filesystem: JSON
 */
function fetchUserProfile(token) {
    //headers including token
    var options={
        hostname:BACK_END_TEST_IP,
        port:BACK_END_TEST_IP,
        path:'/',
        method:'GET',
        token:token,
        timeout:TIMEOUT,
        headers: {
            "Content-Type": "application/json"
        }
    }
    var req = http.request(options,function(res){
        console.log('STATUS:'+res.statusCode);
        console.log('HEADERS:'+JSON.stringify(res.headers));
        res.setEncoding('utf-8');
        res.on('data',function(chunk){
            //some handling on data according to data structure
        });
        res.on('end',function(){
            console.log("user_profile received successfully");
        });
    });
    req.on('error',function(err){
        console.error(err.message);
    });
    req.end();


}



function editUserProfile(token, password, firstname, lastname, email) {}

function fetchFileSystem(token) {}

function createProject(req, res, next) {
    var options = {
        host: 'localhost',
        port: 3030,
        path: '/user/myfile/createfile',
        method: 'POST',
        timeout: TIMEOUT,
        headers: {
            "Content-Type": "application/json"
        }
    };
    var body = JSON.stringify(req.body);
    var fileinfo;
    var request = https.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log(chunk);
            fileinfo = chunk;
            req.specialData = chunk;
            next();
        });
    });
    request.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    request.write(body);
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
module.exports.login = login;
