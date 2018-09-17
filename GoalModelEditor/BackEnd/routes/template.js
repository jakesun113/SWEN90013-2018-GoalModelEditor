/**
 *
 *
 */
"use strict";

const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multiparty = require("multiparty");
const FormData = require("form-data");

// security related imports
const auth = require("../authen");
const db = require(path.resolve(
    __dirname,
    "../../Database/DBModule/DBModule.js"
));

/* GET template editing page */
router.get("/edit", function(req, res) {
    if (req.cookies.LOKIDIED) {
        res.render("user/project/templateEdit");
    }
    res.redirect("/login");
});

/* POST Create template */
router.post("/:userId", (req, res, next) => {
    // check token for authentication
    // if (!auth.authenticate(req.headers)) {
    //     res.statusCode = 401;
    //     res.json({created: false, message: "Authentication failed"});
    //     return res.end();
    // }

    // path to the directory where the goal models should be stored
    // path should be '/etc/GoalModelEditor' but need to find a way to resolve
    // the folder permission problem
    let dirpath = "./UserFiles/" + req.params.userId + "/";
    let xml = req.body.xml;
    console.log("tname:" + req.body.template_name);
    // create new goal model
    db.createTemplate(
        req.body.template_name,
        req.body.description,
        dirpath,
        req.params.userId
    ).then(result => {
        createDirectoryPath(dirpath);
        console.log(result);
        fs.writeFile(
            dirpath + result.TemplateId + ".xml",
            xml,
            function (err) {
                if (err) {
                    res.statusCode = 500;
                    res.json({
                        message:
                        "Failed to create template file on server: " +
                        err.message
                    });
                }
                res.statusCode = 201;
            }
        );
        if (res.statusCode === 500) {
            //res.json({message: 'Failed to create goal model file on server'});
            return res.end();
        }
        res.statusCode = 201;
        res.json({
            template_name: result.TemplateName,
            template_id: result.TemplateId,
            user_id: result.User,
            last_modified: result.LastModified
        });
        return res.end();
    })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.json({message: "Failed to create template"});
            return res.end();
        });
});

/* get template list */
router.get("/list/:userId", (req, res) => {
    // check token for authentication
    if (!auth.authenticate(req.headers)) {
        res.statusCode = 401;
        res.json({created: false, message: "Authentication failed"});
        return res.end();
    }
    db.getTemplateList(req.params.userId)
        .then(result => {
            console.log(result);

            let ret = [];
            for (let x of result) {
                ret.push({
                    template_id: x.TemplateId,
                    template_name: x.TemplateName,
                    description: x.TemplateDescription,
                    last_modified: x.LastModified,
                    dir_path: x.DirPath
                });
            }

            res.statusCode = 200;
            res.json({templates: ret});
            return res.end();
        })
        .catch(err => {
            res.statusCode = 500;
            res.json({
                message: "Failed to get template list: " + err.message
            });
            return res.end();
        });
});

/* DELETE Goal Model */
router.delete("/:userId/:templateId", (req, res) => {
    // check token for authentication
    if (!auth.authenticate(req.headers)) {
        res.statusCode = 401;
        res.json({created: false, message: "Authentication failed"});
        return res.end();
    }

    // delete goal model
    db.deleteTemplate(req.params.userId, req.params.templateId)
        .then(result => {
            console.log(result);
            res.statusCode = 200;
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

/* PUT Edit template Info */
router.put("/info/:userId/:templateId", (req, res) => {
    // check token for authentication
    if (!auth.authenticate(req.headers)) {
        res.statusCode = 401;
        res.json({created: false, message: "Authentication failed"});
        return res.end();
    }

    // update goal model
    let dirpath = "./UserFiles/" + req.params.userId + "/";
    db.updateTemplate(
        req.params.userId,
        req.params.templateId,
        req.body.template_name,
        req.body.description,
        dirpath)
        .then(result => {
            res.statusCode = 200;
            res.json({
                template_id: req.params.templateId,
                template_name: req.body.templateName,
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

/* PUT Edit template file */
router.put("/:userId/:templateId", (req, res) => {
    // check token for authentication
    if (!auth.authenticate(req.headers)) {
        res.statusCode = 401;
        res.json({created: false, message: "Authentication failed"});
        return res.end();
    }
    let xml = req.body.xml;
    // update goal model
    let dirpath = "./UserFiles/" + req.params.userId + "/";
    db.updateTemplateTime(
        req.params.userId,
        req.params.templateId)
        .then(result => {
            fs.writeFile(
                dirpath + result.TemplateId + ".xml",
                xml,
                function (err) {
                    if (err) {
                        res.statusCode = 500;
                        res.json({
                            message:
                            "Failed to create goal model file on server: " +
                            err.message
                        });
                    }
                    res.statusCode = 201;
                }
            );

            res.statusCode = 200;
            res.json({
                template_id: req.params.templateId
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


/* Get template xml */
router.get("/xml/:userId/:templateId", (req, res) => {
    // check token for authentication
    if (!auth.authenticate(req.headers)) {
        //auth is not successful
        res.statusCode = 401;
        res.json({created: false, message: "Authentication failed"});
        return res.end();
    }

    var filepath = ""; //store the file path of goal model in this
    db.getTemplate(req.params.userId, req.params.templateId)
        .then(result => {
            //store the file path
            filepath =
                result.DirPath +
                result.TemplateId +
                ".xml";
            //file path does not exist
            if (filepath === "" || !fs.existsSync(filepath)) {
                console.log(filepath);
                console.log("no such file");
                //set response : file does not exists
                res.statusCode = 500;
                res.json({
                    message:
                        "Failed to open the template: template file does not exists"
                });
                return res.end();
            }
            //read the file and response with a json file
            fs.readFile(filepath, "utf8", function (err, data) {
                if (err) {
                    //error response
                    console.log(err);
                    res.statusCode = 500;
                    res.json({
                        message: "Failed to get the template: " + err.message
                    });
                    return res.end();
                }
                //set response: successfully retrieve the goal model file and response
                // with a json file
                res.statusCode = 200;
                res.json(JSON.parse(JSON.stringify(data)));
                console.log("get template");
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

/* Get template info */
router.get("/:userId/:templateId", (req, res) => {
    // check token for authentication
    if (!auth.authenticate(req.headers)) {
        //auth is not successful
        res.statusCode = 401;
        res.json({created: false, message: "Authentication failed"});
        return res.end();
    }
    console.log("userid tid");
    db.getTemplate(req.params.userId, req.params.templateId)
        .then(result => {
            res.statusCode = 200;
            res.json(result);
            res.end();
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

/** Recursively creates the whole path to a directory
 * @param filepath : the full path of the directory that is to be created
 */
function createDirectoryPath(filepath) {
    if (fs.existsSync(filepath)) {
        return true;
    }
    let dirname = path.dirname(filepath);
    createDirectoryPath(dirname);
    fs.mkdirSync(filepath);
}

// export for use in Express app
module.exports = router;