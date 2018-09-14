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


// export for use in Express app
module.exports = router;