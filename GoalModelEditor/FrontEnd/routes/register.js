var express = require('express');
var router = express.Router();

/* GET registration page */
router.get('/', function(req, res, next) {
    res.render("registration");
});

/* POST register a new user */
router.post('/', function(req, res, next) {
    // check if the required fields are filled

    // send to the back-end server
        // check if the username is occupied
        // if occupied(rejected by the back-end), send a message to the user
        res.json("username taken, please choose another username");
        // if successful, redirct the user to the login page and send a message to the user
        res.json("registration successful");
        res.redirect('/login');
});

module.exports = router;