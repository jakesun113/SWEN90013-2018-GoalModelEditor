/* End-point for project related HTTP requests in back-end REST API.
 *
 */
"use strict";

// express application
const express = require("express");
const router = express.Router();
const path = require("path");

// security related imports
const auth = require("../authen");
const db = require(path.resolve(
    __dirname,
    "../../Database/DBModule/DBModule.js"
));

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
        res.statusCode = 401;
        res.json({ created: false, message: "Authentication failed" });
        return res.end();
    }

    // (2) fetch project list
    db
        .getProjectGoalModelList(req.params.userId)
        .then(result => {
            res.statusCode = 200;
            let projects = {};
            let model;
            for (let i = 0; i < result.length; i++) {
                model = result[i];
                if (model.ProjectId in projects) {
                    projects[model.ProjectId].models.push({
                        model_id: model.ModelId,
                        model_name: model.ModelName,
                        last_modified: model.LastModified
                    });
                } else {
                    projects[model.ProjectId] = {
                        project_name: model.ProjectName,
                        project_id: model.ProjectId,
                        models: [
                            {
                                model_id: model.ModelId,
                                model_name: model.ModelName,
                                last_modified: model.LastModified
                            }
                        ]
                    };
                }
            }
            res.json({ projects: projects });
            return res.end();
        })
        .catch(err => {
            res.statusCode = 500;
            res.json({
                message: "Failed to create new project: " + err.message
            });
            return res.end();
        });
});

/* POST Create Project */
router.post("/:userId", function(req, res, next) {
    // check token for authentication
    if (!auth.authenticate(req.headers)) {
        res.statusCode = 401;
        res.json({ created: false, message: "Authentication failed" });
        return res.end();
    }

    // create new project
    db
        .createProject(
            req.body.project_name,
            req.body.description,
            0,
            req.params.userId
        )
        .then(result => {
            console.log(result);
            res.statusCode = 201;
            res.json({
                project_id: result.ProjectId,
                project_name: result.ProjectName
            });
            return res.end();
        })
        .catch(err => {
            res.statusCode = 500;
            res.json({
                message: "Failed to create new project: " + err.message
            });
            return res.end();
        });
});

/* PUT Edit Project */
router.put("/:userId/:projectId", (req, res, next) => {
    // check token for authentication
    if (!auth.authenticate(req.headers)) {
        res.statusCode = 401;
        res.json({ created: false, message: "Authentication failed" });
        return res.end();
    }

    // get the old project info
    db
        .getProject(req.params.projectId)
        .then(result => {
            if (result.OwnerId !== req.params.userId) {
                res.statusCode = 403;
                res.json({
                    message:
                        "Failed to edit the project: user does not have the authority"
                });
                return res.end();
            }

            // edit project
            db
                .updateProject(
                    req.params.userId,
                    req.params.projectId,
                    req.body.project_name,
                    req.body.description,
                    req.body.size
                )
                .then(result => {
                    console.log(result);
                    res.statusCode = 200;
                    return res.end();
                })
                .catch(err => {
                    res.statusCode = 500;
                    res.json({
                        message: "Failed to update project: " + err.message
                    });
                    return res.end();
                });
        })
        .catch(err => {
            res.statusCode = 404;
            res.json({
                message:
                    "Failed to get the old project information: " + err.message
            });
            return res.end();
        });
});

/* DELETE Delete Project */
router.delete("/:userId/:projectId", (req, res, next) => {
    // check token for authentication
    if (!auth.authenticate(req.headers)) {
        res.statusCode = 401;
        res.json({ created: false, message: "Authentication failed" });
        res.end();
    }

    // get the old project info
    db
        .getProject(req.params.projectId)
        .then(result => {
            if (result.OwnerId !== req.params.userId) {
                res.statusCode = 403;
                res.json({
                    message:
                        "Failed to delete the project: user does not have the authority"
                });
                return res.end();
            }

            // delete project
            db
                .deleteProject(req.params.userId, req.params.projectId)
                .then(result => {
                    console.log(result);
                    res.statusCode = 204;
                    return res.end();
                })
                .catch(err => {
                    res.statusCode = 500;
                    res.json({
                        message: "Failed to delete project: " + err.message
                    });
                    return res.end();
                });
        })
        .catch(err => {
            res.statusCode = 404;
            res.json({
                message:
                    "Failed to get the old project information: " + err.message
            });
            return res.end();
        });
});

// export for use in Express app
module.exports = router;
