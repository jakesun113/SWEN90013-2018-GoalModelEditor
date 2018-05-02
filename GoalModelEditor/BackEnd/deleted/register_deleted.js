'se strict'

const crypto = require('crypto');
const express = require('express');
let router = express.Router();
const DB = require('../dbConn');

router.post('/', (req, res, next) => {
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

    DB.insertUser(username, hashPassword, email, firstname, lastname).then((result)=>{
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
