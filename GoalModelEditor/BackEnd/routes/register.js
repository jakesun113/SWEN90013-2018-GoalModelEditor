'use strict'

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

    //saveToDB(username, hashPassword, email, firstname, lastname);
    DB.insertUser(username, password, email, firstname, lastname);

    console.log('User inserted\n');

    res.statusCode = 200;
    res.contentType("application/json");
    res.send();
});

function saveToDB(username, password) {
    console.log("TODO: connect to DB, save data.\n");
}

module.exports = router;
