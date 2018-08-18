/* End-point for Goal Model related HTTP requests in back-end REST API
 *
 */
"use strict";

const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multiparty = require("multiparty");

// security related imports
const auth = require("../authen");
const db = require(path.resolve(
    __dirname,
    "../../Database/DBModule/DBModule.js"
));

/* GET get the edit page */
router.get("/edit", function(req, res) {
    if (req.cookies.LOKIDIED) {
        res.render("user/project/projectedit");
    }
    res.redirect("/login");
});

/* POST Create Goal Model */
router.post("/:userId/:projectId", (req, res, next) => {
    // check token for authentication
    if (!auth.authenticate(req.headers)) {
        res.statusCode = 401;
        res.json({ created: false, message: "Authentication failed" });
        return res.end();
    }

    // path to the directory where the goal models should be stored
    // path should be '/etc/GoalModelEditor' but need to find a way to resolve
    // the folder permission problem
    let dirpath = "./UserFiles/" + req.params.userId + "/";

    // create new goal model
    db
        .createGoalModel(
            req.body.model_name,
            req.body.description,
            dirpath,
            req.params.projectId
        )
        .then(result => {
            createDirectoryPath(dirpath);

            let init=
            {
                GoalModelProject: {
                    ModelName: result.ModelName,

                        //Goal list: [five goal types][used goal][deleted goal]
                        GoalList: {
                        FunctionalNum: 1,
                            EmotionalNum: 1,
                            QualityNum: 1,
                            NegativeNum: 1,
                            StakeholderNum: 1,
                            Functional: [
                            {
                                GoalID: "F_1",
                                GoalType: "Functional",
                                GoalContent: "",
                                GoalNote: "Goal F_1 Note",
                                SubGoals: []
                            }
                        ],
                            Quality: [
                            {
                                GoalID: "Q_1",
                                GoalType: "Quality",
                                GoalContent: "",
                                GoalNote: "Goal Q_1 Note"
                            }
                        ],
                            Emotional: [
                            {
                                GoalID: "E_1",
                                GoalType: "Emotional",
                                GoalContent: "",
                                GoalNote: "Goal E_1 Note"
                            }
                        ],
                            Negative: [
                            {
                                GoalID: "N_1",
                                GoalType: "Negative",
                                GoalContent: "",
                                GoalNote: "Goal N_1 Note"
                            }
                        ],
                            Stakeholder: [
                            {
                                GoalID: "S_1",
                                GoalType: "Stakeholder",
                                GoalContent: "",
                                GoalNote: "Goal S_1 Note"
                            }
                        ]
                    },

                    Clusters: [
                        {

                        }
                    ]
                }
            };

            fs.writeFile(dirpath + '/' + result.ModelId+'.json', JSON.stringify(init),function(err) {
                if (err) {
                    res.statusCode = 500;
                    res.json({
                        message:
                            'Failed to create goal model file on server: ' +
                            err.message
                    });
                }
                res.statusCode = 201;
            });
            if (res.statusCode === 500) {
                //res.json({message: 'Failed to create goal model file on server'});
                return res.end();
            }
            res.statusCode = 201;
            res.json({
                model_name: result.ModelName,
                model_id: result.ModelId,
                project_id: result.ProjectId,
                last_modified: result.LastModified
            });
            console.log(result.DirPath);
            return res.end();
        })
        .catch(err => {
            res.statusCode = 500;
            res.json({ message: "Failed to create new model" });
            return res.end();
        });
});

/* POST Upload images */
router.post("/images/:userId/:goalmodelId", (req, res, next) => {
    // check token for authentication
    if (!auth.authenticate(req.headers)) {
        res.statusCode = 401;
        res.json({ created: false, message: "Authentication failed" });
        return res.end();
    }

    let form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {
        console.log(err);
        //console.log(fields);
        //console.log(files);
        let j = 0;
        console.log(j++);

        let dirpath = "./UserFiles/" + req.params.userId + "/";
        createDirectoryPath(dirpath);

        let i = 0;
        for (let _ in files["image"]) {
            console.log("pathpath:  " + files["image"][i].path);
            fs.renameSync(
                files["image"][i].path,
                dirpath +
                    req.params.goalmodelId +
                    "-" +
                    files["image"][i].originalFilename,
                function(err) {
                    if (err) {
                        console.log("error when renaming images: " + err);
                        res.statusCode = 500;
                        res.json({
                            created: false,
                            message: "failed to save the images"
                        });
                        return res.end();
                    }
                }
            );
            i++;
        }
    });

    res.statusCode = 201;
    res.json({ created: true });
    console.log("images saved");
    return res.end();
});

/* PUT Edit Goal Model Content */
router.put("/:userId/:goalmodelId", (req, res, next) => {
    // check token for authentication
    if (!auth.authenticate(req.headers)) {
        res.statusCode = 401;
        res.json({ created: false, message: "Authentication failed" });
        return res.end();
    }

    let dirpath = "";
    db.getGoalModel(req.params.goalmodelId)
        .then(result => {
            dirpath = result.DirPath;
            if (dirpath === "") {
                console.log("no such file");
                res.statusCode = 500;
                res.json({
                    message:
                        "Failed to update the goal model: goal model file does not exists"
                });
                return res.end();
            }
            // createDirectoryPath(dirpath);
            fs.writeFile(
                dirpath + "/" + req.params.goalmodelId + ".json",
                JSON.stringify(req.body),
                function(err) {
                    if (err) {
                        console.log(err);
                        res.statusCode = 500;
                        res.json({
                            message: "Failed to update the goal model: " + err.message
                        });
                        return res.end();
                    }
                    res.statusCode = 200;
                    res.json({ content: req.body.content });
                    console.log("Saved!");
                    return res.end();
                }
            );
        })
        .catch(err => {
            if ((err.code = db.INVALID)) {
                res.statusCode = 404;
                res.json({
                    message:
                        "Failed to save the goal model content: " + err.message
                });
                return res.end();
            }
            res.statusCode = 500;
            res.json({
                message: "Failed to save the goal model content: " + err.message
            });
            return res.end();
        });
});

/* PUT Edit Goal Model Info */
router.put("/info/:userId/:goalmodelId", (req, res, next) => {
    // check token for authentication
    if (!auth.authenticate(req.headers)) {
        res.statusCode = 401;
        res.json({ created: false, message: "Authentication failed" });
        return res.end();
    }

    // update goal model
    let dirpath = "./UserFiles/" + req.params.userId + "/";
    db
        .updateGpalModel(
            req.params.goalmodelId,
            req.body.model_name,
            req.body.description,
            dirpath
        )
        .then(result => {
            res.statusCode = 200;
            res.json({
                model_id: req.params.model_id,
                model_name: req.body.model_name,
                description: req.body.description
            });
            return res.end();
        })
        .catch(err => {
            if (err.code === db.ALREADY_EXIST) {
                res.statusCode = 409;
                res.json({
                    message:
                        "Failed to update the goal model information: " +
                        err.message
                });
                return res.end();
            } else if (err.code === db.INVALID) {
                res.statusCode = 404;
                res.json({
                    message:
                        "Failed to update the goal model information: " +
                        err.message
                });
                return res.end();
            }
        });
});

/* DELETE Goal Model */
router.delete("/:userId/:goalmodelId", (req, res, next) => {
    // check token for authentication
    if (!auth.authenticate(req.headers)) {
        res.statusCode = 401;
        res.json({ created: false, message: "Authentication failed" });
        return res.end();
    }

    // delete goal model
    db
        .deleteGoalModel(req.params.goalmodelId)
        .then(result => {
            console.log(result);
            res.statusCode = 204;
            return res.end();
        })
        .catch(err => {
            res.statusCode = 500;
            res.json({
                message: "Failed to delete goal model: " + err.message
            });
            return res.end();
        });
});

/* Get Goal Model Content */
router.get("/:userId/:goalmodelId", (req, res, next) => {
    // check token for authentication
    if (!auth.authenticate(req.headers)) {
        //auth is not successful
        res.statusCode = 401;
        res.json({ created: false, message: "Authentication failed" });
        return res.end();
    }

    var filepath = ""; //store the file path of goal model in this
    db.getGoalModel(req.params.goalmodelId)
        .then(result => {
            //store the file path
            filepath = result.DirPath + "/" + result.ModelId + ".json";
            //file path does not exist
            if (filepath === "" || !fs.existsSync(filepath)) {
                console.log(filepath);
                console.log("no such file");
                //set response : file does not exists
                res.statusCode = 500;
                res.json({
                    message:
                        "Failed to open the goal model: goal model file does not exists"
                });
                return res.end();
            }
            //read the file and response with a json file
            fs.readFile(filepath, 'utf8', function(err, data) {
                if (err) {
                    //error response
                    console.log(err);
                    res.statusCode = 500;
                    res.json({
                        message: "Failed to get the goal model: " + err.message
                    });
                    return res.end();
                }
                //set response: successfully retrieve the goal model file and response
                // with a json file
                res.statusCode = 200;
                res.json(JSON.parse(JSON.stringify(data)));
                console.log("get goal model");
                return res.end();
            });
        })
        .catch(err => {
            if ((err.code = db.INVALID)) {
                //if db response err code "INVALID"
                //set response : goal model is not found
                res.statusCode = 404;
                res.json({
                    message:
                        "Failed to get the goal model content: " + err.message
                });
                return res.end();
            }
            //set response: failed to get goal model
            res.statusCode = 500;
            res.json({
                message: "Failed to get the goal model content: " + err.message
            });
            return res.end();
        });
});

/* Recursively creates the whole path to a directory */
function createDirectoryPath(filePath) {
    if (fs.existsSync(filePath)) {
        return true;
    }
    let dirname = path.dirname(filePath);
    createDirectoryPath(dirname);
    fs.mkdirSync(filePath);
}

module.exports = router;
