"use strict";

let jwt = require("jsonwebtoken");
const SECRET = "I'm a dummy secret";
const ONEDAY = 86400;

function genToken(user_id) {
    let token = jwt.sign({ id: user_id }, SECRET, { expiresIn: ONEDAY });
    console.log("token generated: " + token);
    return token;
}

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
