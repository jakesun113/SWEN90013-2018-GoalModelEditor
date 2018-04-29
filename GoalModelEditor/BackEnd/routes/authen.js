var jwt = require("jsonwebtoken");

function genToken(user_id){
    var token = jwt.sign({id: user_id}, "I'm a dummy secret", {expiresIn: 86400});
    console.log("token generated: " + token);
    return token;
}

module.exports.genToken = genToken;