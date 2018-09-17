/* End point for querying html pages.
 *
 * Routes including:
 *   GET '/'          get the home page
 *   GET '/login'     get the login (dashboard) page based on login status
 *   GET '/register'  get the user registration page
 *   GET '/dashboard' get the dashboard (login) page based on login status
 *   GET '/profile'   get the user profile page
 *   GET '/template'   get the templating page
 */
"use strict";

let express = require("express");
let router = express.Router();

/* GET home page */
router.get("/", function(req, res) {
    res.render("index", { title: "Express" });
});

/* GET login page */
router.get("/login", function(req, res) {
    if (req.cookies.LOKIDIED) {
        // the user is logged in
        res.redirect("/dashboard");
    }
    res.render("login");
});

/* GET the registration page */
router.get("/register", function(req, res) {
    res.render("register");
});

/* GET the dashboard page */
router.get("/dashboard", function(req, res) {
    if (req.cookies.LOKIDIED) {
        res.render("user/project/dashboard");
    }
    // the user is not logged in
    res.redirect("/login");
});

/* GET the user profile page */
router.get("/profile", function(req, res) {
    if (req.cookies.LOKIDIED) {
        res.render("user/userprofile");
    }
    // the user is not logged in
    res.redirect("/login");
});

module.exports = router;
