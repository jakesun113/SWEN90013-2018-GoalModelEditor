'use strict'

var express = require('express');
var router = express.Router();

/* GET login page */
router.get('/', function(req, res, next) {
    res.render("login");
});

/* Log in the current user */
router.post('/', function(req, res, next) {
    // check if both fields are filled
    if(!req.body.username || !req.body.password) {
        return res.redirect('/user/login');
    } else {
        // send req to the back-end server
        // receive res (confirmation/rejection) and user info(identical for each user)
        // if successful, rediret the user to file system page and send a message to the user
        res.json("Hi, " + req.body.username + "!");
        res.redirect('/user/myfile');
        // otherwise send a message to user
        res.json("Wrong username/password.");
    }
});


module.exports = router;
