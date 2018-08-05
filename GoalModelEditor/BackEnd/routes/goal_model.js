/* End-point for Goal Model related HTTP requests in back-end REST API
 *
 */


const express = require("express");
const router = express.Router();
const path = require('path');
const fs = require('fs');

// security related imports
const auth = require("../authen");
const db = require(path.resolve(__dirname, "../../Database/DBModule/DBModule.js"));

/* GET get the edit page */
router.get('/edit', function (req, res) {
    if(req.cookies.LOKIDIED){
        res.render('user/project/projectedit');
    }
    res.redirect('/login');
});

/* POST Create Goal Model */
router.post("/:userId/:projectId",
    (req, res, next) => {
        // check token for authentication
        if (!auth.authenticate(req.headers)) {
            res.statusCode = 401;
            res.json( {created: false, message: "Authentication failed"} );
            return res.end();
        }

        // path to the directory where the goal models should be stored
        // path should be '/etc/GoalModelEditor' but need to find a way to resolve the folder permission problem
        var dirpath = "./UserFiles/" + req.params.userId + "/";

        // create new goal model
        db.createGoalModel(req.body.model_name, req.body.description, dirpath,
            req.params.projectId).then((result)=>{
            createDirectoryPath(dirpath);
            fs.writeFile(dirpath + "/" + result.ModelId, "", function (err) {
                if (err) {
                    res.statusCode = 500;
                    res.json({message: "Failed to create goal model file on server: " + err.message})
                }
                res.statusCode = 201;
            });
            if (res.statusCode == 500){
                //res.json({message: 'Failed to create goal model file on server'});
                return res.end();
            }
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

/* PUT Edit Goal Model Content */
router.put("/:userId/:goalmodelId/save",
    (req, res, next) => {
        // check token for authentication
        if (!auth.authenticate(req.headers)) {
            res.statusCode = 401;
            res.json( {created: false, message: "Authentication failed"} );
            return res.end();
        }

        var filepath = "";
        db.getGoalmodel(req.params.goalmodelId).then(result => {
            filepath = result.filepath;
        }).catch(err => {
            if (err.code = db.INVALID){
                res.statusCode = 404;
                res.json({message: "Failed to save the goal model content: " + err.message});
                return res.end();
            }
            res.statusCode = 500;
            res.json({message: "Failed to save the goal model content: " + err.message});
            return res.end();
        })
        if (filepath == "" || !fs.existsSync(filepath)) {
            console.log("no such file");
            res.statusCode = 500;
            res.json({message: 'Failed to update the goal model: goal model file does not exists'})
            return res.end();
        }
        fs.writeFile(filepath, req.body.content, function (err) {
            if (err){
                console.log(err);
                res.statusCode = 500;
                res.json({message: "Failed to update the goal model: " + err.message})
                return res.end();
            }
            res.statusCode = 200;
            res.json({content: req.body.content});
            console.log('Saved!');
            return res.end();
        });
    }
);

/* PUT Edit Goal Model Info */
router.put("/:userId/:goalmodelId",
    (req, res, next) => {
        // check token for authentication
        if (!auth.authenticate(req.headers)) {
            res.statusCode = 401;
            res.json( {created: false, message: "Authentication failed"} );
            return res.end();
        }

        // update goal model
        filepath = "/etc/GoalModelEditor/" + req.params.userId + "/" + req.params.goalmodelId;
        db.updateGpalModel(req.params.goalmodelId, req.body.model_name, req.body.description, filepath)
            .then((result) => {
                res.statusCode = 200;
                res.json({
                    model_id: req.params.model_id,
                    model_name: req.body.model_name,
                    description: req.body.description
                });
                return res.end();
            }).catch(err => {
                if (err.code == db.ALREADY_EXIST){
                    res.statusCode = 409;
                    res.json({message: "Failed to update the goal model information: " + err.message});
                    return res.end();
                } else if (err.code == db.INVALID){
                    res.statusCode = 404;
                    res.json({message: "Failed to update the goal model information: " + err.message});
                    return res.end();
                }
        })
    }
);

/* DELETE Goal Model */
router.delete("/:userId/:goalmodelId",
    (req, res, next) => {
        // check token for authentication
        if (!auth.authenticate(req.headers)) {
            res.statusCode = 401;
            res.json( {created: false, message: "Authentication failed"} );
            return res.end();
        }

        // delete goal model
        db.deleteGoalModel(req.params.goalmodelId).then((result)=>{
            console.log(result);
            res.statusCode = 204;
            return res.end();
        }).catch(err => {
            res.statusCode = 500;
            res.json({message: 'Failed to delete goal model: ' + err.message});
            return res.end();
        });
    }
);

/* Recursively creates the whole path to a directory */
function createDirectoryPath(filePath) {
    if (fs.existsSync(filePath)) {
        return true;
    }
    var dirname = path.dirname(filePath);
    createDirectoryPath(dirname);
    fs.mkdirSync(filePath);
}

module.exports = router;
