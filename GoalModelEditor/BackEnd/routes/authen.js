/* Module for authentication functionality
 *
 * methods including:
 *   getToken(user_id)    generates the jwt token using user id
 *   authenticate(header) verify the jwt token
 */
"use strict";

let jwt = require("jsonwebtoken");

// TODO: extract this out to a config file
const SECRET = "I'm a dummy secret";
// seconds in a day
const ONEDAY = 86400;


/** Generate the jwt token based on user id
 * @param user_id
 * @return token : jwt token encrypted with user id
 */
function genToken(user_id) {
    let token = jwt.sign({ id: user_id }, SECRET, { expiresIn: ONEDAY });
    console.log("token generated: " + token);
    return token;
}

/** Authenticate the jwt token
 * @param headers : the http request headers containing 'Authorization'
 * @return true : token is valid
 * @return false : token id invalid
 */
function authenticate(headers) {
    let authString = headers["Authorization"];
    if (!authString) {
        return false;
    }
    let token = authString.split(" ")[1];
    try {
        let decoded = jwt.verify(token, SECRET);
        // TODO: return id to check authorization
    } catch (err) {
        return false;
    }
    return true;
}

module.exports.genToken = genToken;
module.exports.authenticate = authenticate;
