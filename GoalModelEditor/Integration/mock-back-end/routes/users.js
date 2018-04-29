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
    res.status(200)({
        message : "Registration"
    });
});

// (2) login
//router.get("/");

// (3) retrieve profile
//router.get("/");

// (4) edit profile
//router.post("/");

module.exports = router;
