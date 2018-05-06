/* End-point for project related HTTP requests in back-end REST API.
 *
 */


// express application
const express = require('express');
const router = express.Router();

// security related imports
const auth = require("../authen");
const db = require("../dbConn");

// response codes
const response_codes = require("./response_codes");


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

    // (1) authenticate request
    if (!auth.authenticate(req.headers)) {
        res.statusCode = response_codes.ERROR.UNAUTHORIZED_REQUEST;
        res.end();
    }

    // (2) fetch project list

});


/* POST Create Project */
router.post("/create/:userId", function(req, res, next){

    // check token for authentication
    if (!auth.authenticate(req.headers)) {
        res.statusCode = 401;
        res.json( {created: false, message: "Authentication failed"} );
        res.end();
    }

    // create new project
    db.createProject(req.body.project_name, req.body.description, req.body.size, req.params.userId).then((result)=>{
        console.log(result);
        if(result != db.UNKNOWN_ERROR) {
            res.statusCode = 201;
            res.json(result);
        } else {
            res.statusCode = 500;
            res.json({message: 'Failed to create new project'})
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
