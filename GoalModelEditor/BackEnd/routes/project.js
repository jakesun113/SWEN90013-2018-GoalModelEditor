/* End-point for project related HTTP requests in back-end REST API.
 *
 */


// express application
var express = require('express');
var router = express.Router();

// security related imports
var auth = require("./authen");
var db = require("../dbConn");


/* GET List (a user's) File System */
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

    // check token for authentication
    if (!auth.authenticate(req.headers)) {
        res.statusCode = 401;
        res.json( {created: false, message: "Authentication failed"} );
        res.end();
    }

    // create new project
    db.createProject("a", "d", 1, "abc").then((result)=>{
        console.log(result);
        if(result == db.SUCCESS) {
            res.statusCode = 201;
            res.json( {project_id: "asd"} );
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
