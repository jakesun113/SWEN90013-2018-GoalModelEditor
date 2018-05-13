/* End point for user-related HTTPS requests to the back-end REST API.
 *
 */

// express application imports
const express = require('express');
const router = express.Router();

// database connection
const db = require("../DBModule/DBModule.js");

// security-related imports
const auth = require("../authen");
const crypto = require('crypto');

const response_codes = require("./response_codes");

/* POST User Login */
router.post('/login', function(req, res, next) {
    const hash = crypto.createHash('sha256');
    console.log("in login func");
    hash.update(req.body.password);
    let promise = db.login(req.body.username, hash.digest("hex"));
    promise.then(function(user_id){
        console.log("result is " + user_id);
        let token = auth.genToken(user_id);
        //let token = auth.genToken(1);
        res.statusCode = 200;
        res.contentType("application/json");
        res.json({user_id : user_id, token: token});
        return res.end();
    }).catch(err => {
        if (err.code == db.INVALID){
            res.statusCode = 401;
            res.json({user_id: "", message: "User login failed: " + err.message});
            return res.end();
        }
        res.statusCode = 500;
        res.json({message: 'User login failed: ' + err.message});
        return res.end();
    })
});

router.post('/register', (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let hashPassword = crypto.createHash('sha256').update(password).digest('hex');

    db.insertUser(username, hashPassword, email, firstname, lastname).then((result)=>{
        console.log(result);
        res.statusCode = 200;
        res.contentType("application/json");
        return res.send({
            username : username,
            email : email,
            firstname : firstname,
            lastname : lastname
        });
    }).catch(err => {
        if (err.code == db.ALREADY_EXIST) {
            res.statusCode = 409;
            res.json({message: "User registration failed: " + err.message});
            return res.end();
        }
        res.statusCode = 500;
        res.json({message: "User registration failed: " + err.message});
        return res.end();
    });
});

module.exports = router;
