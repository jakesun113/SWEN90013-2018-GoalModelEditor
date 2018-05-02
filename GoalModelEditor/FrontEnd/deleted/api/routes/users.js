/* Users Resource Endpooint
 *
 */

const express = require("express");
const router = express.Router();
const request = require("request");

/* User Registration */
router.get("/" (req, res, next) => {
    
    // parse the request
    var payload = JSON.parse(JSON.stringify(req));

    // perform validation on the request

    // formulate request to back-end
    request.get(
        { url:
        , json: true
        , body: payload
        , cert: 
        , key: 
        , rejectUnauthorize: false
        }
    );
});

/* User Login */

/* Fetch Profile */

/* Edit Profile */

module.exports = router;

