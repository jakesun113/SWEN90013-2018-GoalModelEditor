'use strict'

const crypto = require('crypto');
const express = require('express');
let router = express.Router();
const DB = require('../dbConn');

router.post('/', (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let firsname = req.body.firsname;
    let lastname = req.body.lastname;

    let hashPassword = crypto.createHash('sha256').update(password).digest('hex');

    //saveToDB(username, hashPassword);
    DB.insertUser(username, password, email, firstname, lastname);

    console.log('user inserted\n');

    res.statusCode = 200;
    res.contentType("application/json");
    res.send();
});

function saveToDB(username, password) {
    console.log("TODO: connect to DB, save data.\n");
}

module.exports = router;
