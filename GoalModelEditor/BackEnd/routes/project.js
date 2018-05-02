/* End-point for project related HTTP requests in back-end REST API.
 *
 */


var express = require('express');
var router = express.Router();
var auth = require("./authen");
var db = require("../dbConn");


/* GET Fetch File System */
/* This should return a JSON (or some other equivalent data structure)
 * list of goal model project names AND the the names of goal models
 * with those projects. For example:
 *
 *      {
 *          "project1": ["goalmodel_a", "goalmodel_b"]
 *          "project2": ["goalmodel_c", "goalmodel_d"]
 *      }
 *
 */
router.get("/list/:userId", (req, res, next) => {
    // stub
});

/* POST Create Project */
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


/* POST Edit Project */
router.post("/edit/:userId-:projectId", (req, res, next) => {
    // stub
});


/* DELETE Delete Project */
router.delete("/delete/:userId-:projectId", (req, res, next) => {
    // stub
});


// export for use in Express app
module.exports = router;
