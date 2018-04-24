var express = require('express');
var router = express.Router();
const crypto = require('crypto');
// var passport = require('passport');
// var LocalStrategy = require('passport-local').Strategy;

router.post('/', function(req, res, next) {
    const hash = crypto.createHash('sha256');
    console.log("in login func");
    console.log("request body");
    console.log(req.body.username);
    hash.update(req.body.password);
    console.log(req.body.password)
    console.log("in login func 2");
    if (hash.digest("hex") == "30c952fab122c3f9759f02a6d95c3758b246b4fee239957b2d4fee46e26170c4") {
        var token = crypto.randomBytes(64).toString('hex');
        console.log(token);
        saveSession(req.body.username, token);
        res.statusCode = 200;
        res.contentType("application/json");
        res.json({token: token});
    } else {
        res.statusCode = 401;
    }
    res.end();
});

function saveSession(username, token){
    console.log("placeholder of session handling\ntoken generated: " + token);
}

module.exports = router;
//
// passport.use(new LocalStrategy())