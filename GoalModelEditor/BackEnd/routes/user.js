var express = require('express');
var router = express.Router();
var auth = require("./authen");
var db = require("../dbConn");
const crypto = require('crypto');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// User login route
router.post('/login', function(req, res, next) {
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

router.post('/register', (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let hashPassword = crypto.createHash('sha256').update(password).digest('hex');

    // console.log(username + '\n');
    // console.log(password + '\n');
    // console.log(email + '\n');
    // console.log(firstname + '\n');
    // console.log(lastname + '\n');
    // console.log(hashPassword + '\n');

    db.insertUser(username, hashPassword, email, firstname, lastname).then((result)=>{
        console.log(result);
        if(result == DB.REG_SUCCESS) {
            res.statusCode = 200;
        } else if (result == DB.REG_ALREADY_EXIST) {
            res.statusCode = 409;
        } else {
            res.statusCode = 400;
        }
        res.contentType("application/json");
        res.send();
    });
});

module.exports = router;
