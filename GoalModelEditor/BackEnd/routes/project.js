var express = require('express');
var router = express.Router();
var auth = require("./authen");
var db = require("../dbConn");

router.post("/create", function(req, res, next){
    if (!auth.authenticate(req.headers)) {
        res.statusCode = 401;
        res.json({created: false, message: "Authentication failed"});
        res.end();
    }
    db.createProject("a", "d", 1, "abc").then((result)=>{
        console.log(result);
        if(result == DB.SUCCESS) {
            res.statusCode = 201;
            res.json({project_id: "asd"});
        } else {
            res.statusCode = 500;
        }
    });
    res.end();
});

module.exports = router;