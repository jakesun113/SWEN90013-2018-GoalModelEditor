'use strict'

const crypto = require('crypto');
const express = require('express');
let router = express.Router();

router.post('/', (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;

    let hashPassword = crypto.createHash('sha256').update(password).digest('hex');

    saveToDB(username, hashPassword);

    res.statusCode = 200;
    res.contentType("application/json");
    res.send();
});

function saveToDB(username, password) {
    console.log("TODO: connect to DB, save data.\n");
}

module.exports = router;
