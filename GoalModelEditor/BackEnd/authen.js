/* Authentication functions for REST API
 * 
 * Responsible for generating unique OAuth tokens for clients, as well
 * as verifying tokens sent by clients.
 */
'use strict';

// module handling OAuth
const jwt = require("jsonwebtoken");

const SECRET = "I'm a dummy secret"; // used to generate tokens
const SECONDS_VALID = 86400; // length (seconds) that token is valid for

// generate OAuth token for a given user
function genToken(user_id){
    let token = jwt.sign({id: user_id}, SECRET, {expiresIn: SECONDS_VALID});
    //console.log("token generated: " + token);
    return token;
}

// verify header sent by a user
function authenticate(headers) {
    var authString = headers.authorization;

    // check that header contains authorization metadata 
    if (!authString){
        return false
    }

    // if so, extract token from authorization metadata
    var token = authString.split(" ")[1];
    try {
        jwt.verify(token, SECRET);
    } catch(err) {
        // verification error - return false
        return false
    }
    return true
}

module.exports.genToken = genToken;
module.exports.authenticate = authenticate;
