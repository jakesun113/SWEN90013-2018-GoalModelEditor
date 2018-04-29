var express = require('express');
var auth = require("./authen");
var router = express.Router();
const crypto = require('crypto');

router.post('/', function(req, res, next) {
    const hash = crypto.createHash('sha256');
    console.log("in login func");
    hash.update(req.body.password);
    //var user = getUser(req.body.username);
    if (hash.digest("hex") == "30c952fab122c3f9759f02a6d95c3758b246b4fee239957b2d4fee46e26170c4") {
        //var token = auth.genToken(user.id);
        var token = auth.genToken(1);
        res.statusCode = 200;
        res.contentType("application/json");
        //res.json({user_id : user.id, token: token});
        res.json({user_id : 1, token: token});
    } else {
        res.statusCode = 401;
    }
    res.end();
});

module.exports = router;