var jwt = require("jsonwebtoken");
const secret = "I'm a dummy secret";

function genToken(user_id){
    var token = jwt.sign({id: user_id}, secret, {expiresIn: 86400});
    console.log("token generated: " + token);
    return token;
}

function authenticate(headers) {
    var authString = headers["Authorization"];
    if (!authString){
        return false
    }
    var token = authString.split(" ")[1];
    try {
        var decoded = jwt.verify(token, SECRETE);
    } catch(err) {
        return false
    }
    return true
}

module.exports.genToken = genToken;
module.exports.authenticate = authenticate;