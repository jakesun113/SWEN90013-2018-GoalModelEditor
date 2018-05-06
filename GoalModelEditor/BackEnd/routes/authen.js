var jwt = require("jsonwebtoken");
const SECRET = "I'm a dummy secret";
const ONEDAY = 86400

function genToken(user_id){
    var token = jwt.sign({id: user_id}, SECRET, {expiresIn: ONEDAY});
    console.log("token generated: " + token);
    return token;
}

function authenticate(headers) {
    var authString = headers["Authorization"];
    if (!authString){
        return false;
    }
    var token = authString.split(" ")[1];
    try {
        var decoded = jwt.verify(token, SECRET);
    } catch(err) {
        return false;
    }
    return true;
}

module.exports.genToken = genToken;
module.exports.authenticate = authenticate;