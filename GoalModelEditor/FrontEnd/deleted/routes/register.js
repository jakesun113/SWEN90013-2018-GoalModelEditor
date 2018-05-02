var express = require('express');
var router = express.Router();
var integration = require('../api');

/* GET registration page */
router.get('/', function(req, res, next) {
    res.render("registration");
    console.log("here");
});

/* POST register a new user */
router.post('/', integration.register, function(req, res, next) {
    // check if the required fields are filled
    console.log("in second function of register.js");
    // send to the back-end server
        // check if the username is occupied
        // if occupied(rejected by the back-end), send a message to the user
        res.json("username taken, please choose another username");
        // if successful, redirct the user to the login page and send a message to the user
        res.json("registration successful");
        res.redirect('/login');
});

module.exports = router;