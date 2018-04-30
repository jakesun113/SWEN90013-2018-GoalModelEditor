/* Mock users route.
 *
 * Simulates functionality for:
 *      (1) Registration;
 *      (2) Login;
 *      (3) Retreiving profile;
 *      (4) Editing profile.
 */

const express = require("express");
const router = express.Router();

// (1) registration
router.post("/", (req, res, next) => {
    
    // if user does not already exist
    if (true) {
        res.status(201).json({
            message : "Confirming user " + req.body.username + " created."
        });
    }

    // if user does al;ready exist
    else {
        res.status(402).json({

        });
    }
});

// (2) login
router.get("/", (req, res, next) => {

    // if valid username and password combination
    if (true) {
        res.status(200).json({
            message : "Success",
            userid : "USER-0001",
            token : "TOKEN-USER-0001"
        });
    }

    // if invalid username and password combination
    else {
        res.status(402).json({
            message : "Failure"
        });
    }
});

// (3) retrieve profile
//router.get("/");

// (4) edit profile
//router.post("/");

module.exports = router;
