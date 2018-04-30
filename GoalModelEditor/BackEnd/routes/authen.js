var jwt = require("jsonwebtoken");
const secret = "I'm a dummy secret";

function genToken(user_id){
    var token = jwt.sign({id: user_id}, secret, {expiresIn: 86400});
    console.log("token generated: " + token);
    return token;
}

function authenticate(headers) {
    var token = headers['x-access-token'];
    if (!token){
        return false
    }
    try {
        var decoded = jwt.verify(token, secret);
    } catch(err) {
        return false
    }
    return true
}

module.exports.genToken = genToken;
module.exports.authenticate = authenticate;