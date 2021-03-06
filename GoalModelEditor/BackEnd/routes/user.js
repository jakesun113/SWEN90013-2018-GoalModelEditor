/* End point for user-related HTTPS requests to the back-end REST API.
 *
 * Routes including:
 *   POST '/user/login'               user login
 *   POST '/user/register'            register new user
 *   GET  '/user/profile/:userId'     get user profile
 *   PUT  '/user/profile/:userId'     update user profile
 *   PUT  '/user/cred/:userId'        user change password
 */
"use strict";

// express application imports
const express = require("express");
const router = express.Router();
const path = require("path");

// database connection
const db = require(path.resolve(
    __dirname,
    "../../Database/DBModule/DBModule.js"
));

// security-related imports
const auth = require("../authen");
const crypto = require("crypto");

/* POST User Login */
router.post("/login", function (req, res) {
    const hash = crypto.createHash("sha256");
    hash.update(req.body.password);
    let promise = db.login(req.body.username, hash.digest("hex"));
    promise.then(function (user_id) {
            console.log("result is " + user_id);
            let token = auth.genToken(user_id);
            res.statusCode = 200;
            res.contentType("application/json");
            res.json({ user_id: user_id, token: token });
            return res.end();
        })
        .catch(err => {
            if (err.code === db.INVALID) {
                res.statusCode = 401;
                res.json({
                    user_id: "",
                    message: "User login failed: " + err.message
                });
                return res.end();
            }
            res.statusCode = 500;
            res.json({ message: "User login failed: " + err.message });
            return res.end();
        });
});

/* POST register a new user */
router.post("/register", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let hashPassword = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");

    db.insertUser(username, hashPassword, email, firstname, lastname)
        .then(result => {
            console.log(result);
            res.statusCode = 200;
            res.contentType("application/json");
            return res.send({
                username: username,
                email: email,
                firstname: firstname,
                lastname: lastname
            });
        })
        .catch(err => {
            if (err.code === db.ALREADY_EXIST) {
                // user is already in the database
                res.statusCode = 409;
                res.json({
                    message: "User registration failed: " + err.message
                });
                return res.end();
            }
            res.statusCode = 500;
            res.json({ message: "User registration failed: " + err.message });
            return res.end();
        });
});

/* GET User Profile */
router.get("/profile/:userId", function (req, res) {
    // check token for authentication
    if (!auth.authenticate(req.headers)) {
        res.statusCode = 401;
        res.json({ created: false, message: "Authentication failed" });
        return res.end();
    }

    // get user profile from db
    db.getUserProfile(req.params.userId)
        .then(result => {
            res.statusCode = 200;
            res.json({
                username: result.UserName,
                firstname: result.FirstName,
                lastname: result.LastName,
                email: result.Email
            });
            return res.end();
        })
        .catch(err => {
            if (err.code === db.INVALID) {
                res.statusCode = 404;
                res.json({
                    message: "Failed to get user profile: " + err.message
                });
                return res.end();
            }
            res.statusCode = 500;
            res.json({ message: "Failed to get user profile: " + err.message });
            return res.end();
        });
});

/* PUT Change User Profile */
router.put("/profile/:userId", function (req, res) {
    // check token for authentication
    if (!auth.authenticate(req.headers)) {
        res.statusCode = 401;
        res.json({ created: false, message: "Authentication failed" });
        return res.end();
    }

    // update user profile in db
    db.updateUserProfile(
            req.params.userId,
            req.body.firstname,
            req.body.lastname,
            req.body.email
        )
        .then(result => {
            res.statusCode = 200;
            res.json({
                user_id: req.params.userId,
                firstname: result.FirstName,
                lastname: result.LastName,
                email: result.Email
            });
            return res.end();
        })
        .catch(err => {
            if (err.code === db.INVALID) {
                res.statusCode = 404;
                res.json({
                    message: "Failed to update user profile: " + err.message
                });
                return res.end();
            }
            res.statusCode = 500;
            res.json({
                message: "Failed to update user profile: " + err.message
            });
            return res.end();
        });
});

/* PUT Change User Password */
router.put("/cred/:userId", function (req, res) {
    // check token for authentication
    if (!auth.authenticate(req.headers)) {
        res.statusCode = 401;
        res.json({ created: false, message: "Authentication failed" });
        return res.end();
    }

    // hash the old password
    const oldhash = crypto.createHash("sha256");
    console.log("in login func");
    oldhash.update(req.body.old_password);
    let oldpw = oldhash.digest("hex");

    // hash the new password
    const newhash = crypto.createHash("sha256");
    console.log("in login func");
    newhash.update(req.body.new_password);
    let newpw = newhash.digest("hex");

    // update the password in the database
    db.changePassword(req.params.userId, oldpw, newpw)
        .then(result => {
            res.statusCode = 200;
            return res.end();
        })
        .catch(err => {
            if (err.code === db.INVALID) {
                // old password is invalid
                res.statusCode = 404;
                res.json({
                    message:
                        "Failed to change user password: Old password invalid"
                });
                return res.end();
            }
            res.statusCode = 500;
            res.json({
                message: "Failed to change user password: " + err.message
            });
            return res.end();
        });
});

module.exports = router;
