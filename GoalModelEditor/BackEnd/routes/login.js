var express = require('express');
var auth = require("./authen");
var router = express.Router();
var db = require("../dbConn");
const crypto = require('crypto');

// User login route
router.post('/', function(req, res, next) {
    const hash = crypto.createHash('sha256');
    console.log("in login func");
    hash.update(req.body.password);
    let promise = db.login(req.body.username, hash.digest("hex"));
    promise.then(function(user_id){
        console.log("result is " + user_id);
        if (user_id == db.LOGIN_INVALID){
            res.statusCode = 401;
            res.json({user_id: "", message: "User login authentication failed"});
            res.end();
        }
        let token = auth.genToken(user_id);
        //let token = auth.genToken(1);
        res.statusCode = 200;
        res.contentType("application/json");
        res.json({user_id : user_id, token: token});
        res.end();
    })
});

module.exports = router;