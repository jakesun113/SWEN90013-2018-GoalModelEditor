/**
 *
 *
 */
"use strict";

const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multiparty = require("multiparty");
const FormData = require("form-data");

// security related imports
const auth = require("../authen");
const db = require(path.resolve(
    __dirname,
    "../../Database/DBModule/DBModule.js"
));

/*
GET get the template page
  */
router.get("/:template", function (req, res) {
    // check token for authentication
    if (!auth.authenticate(req.headers)) {
        res.statusCode = 401;
        res.json({created: false, message: "Authentication failed"});
        return res.end();
    }
    let templateName = req.params.template;
    // TODO


    res.statusCode = 200;
    return res.end();
});


// export for use in Express app
module.exports = router;