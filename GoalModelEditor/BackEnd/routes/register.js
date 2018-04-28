'use strict'

const crypto = require('crypto');
const express = require('express');
let router = express.Router();

router.post('/', (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;

    let hashUsername = crypto.createHash('sha256').update(username).digest('hex');
    let hashPassword = crypto.createHash('sha256').update(password).digest('hex');

    saveToDB(hashUsername, hashPassword);
});

function saveToDB(username, password) {
    console.log("TODO: connect to DB, save data.\n");
}

module.exports = router;
