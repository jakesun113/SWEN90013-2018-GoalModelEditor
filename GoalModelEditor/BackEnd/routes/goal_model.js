/* End-point for Goal Model related HTTP requests in back-end REST API
 *
 */


const express = require("express");
const router = express.Router();

// security related imports
const auth = require("../authen");
const db = require("../DBModule/DBModule.js");


/* POST Create Goal Model */
router.post("/:userId/:projectId",
    (req, res, next) => {
        // check token for authentication
        if (!auth.authenticate(req.headers)) {
            res.statusCode = 401;
            res.json( {created: false, message: "Authentication failed"} );
            return res.end();
        }

        // create new goal model
        db.createGoalModel(req.body.model_name, req.body.description, "", req.params.projectId)
            .then((result)=>{
            res.statusCode = 201;
            res.json({
                model_name : result.ModelName,
                model_id : result.ModelId,
                project_id : result.ProjectId,
                last_modified: result.LastModified
            });
            return res.end();
        }).catch(err => {
            res.statusCode = 500;
            res.json({message: 'Failed to create new model'})
            return res.end();
        });
    }
);


/* PUT Edit Goal Model */
router.put("/:userId/:goalmodelId",
    (req, res, next) => {
        // stub
    }
);


/* DELETE Goal Model */
router.delete("/:userId/:goalmodelId",
    (req, res, next) => {
        // stub
    }
);

module.exports = router;
