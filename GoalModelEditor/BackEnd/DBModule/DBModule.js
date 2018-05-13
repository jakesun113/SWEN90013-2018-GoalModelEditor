'use strict';
const mysql = require('mysql');
const Promise = require('bluebird');

const dbconfig = require('./dbconfig.json');

let pool = null;

/**
 * The SQL sentence to insert a user with fields escaped;
 * @type {string}
 */
const SQL_USER_REGISTER = "INSERT INTO " +
    "User (UserId, Username, Password, Email, FirstName, LastName, SignupTime, LastLogin) " +
    "VALUES (UUID(), ?, ?, ?, ?, ?, NOW(), NOW())";
/**
 * The SQL sentence to check user name and password and update the LastLogin field;
 * @type {string}
 */
const SQL_USER_LOGIN = "UPDATE User SET LastLogin = NOW()" +
    "WHERE BINARY Username = ? AND Password = ?";
/**
 * The SQL sentence to retrieve userid
 * @type {string}
 */
const SQL_RET_USERID = "SELECT UserId from User WHERE BINARY Username = ? AND Password = ?";
/**
 * The SQL sentence to retrieve projectid
 * @type {string}
 */
const SQL_RET_PROJECTID = "SELECT * from Project WHERE BINARY ProjectName = ? AND OwnerId = ?";
/**
 * The SQL sentence to create a project
 * @type {string}
 */
const SQL_CREATE_PROJ = "INSERT INTO " +
    "Project (ProjectId, ProjectName, ProjectDescription, Size, OwnerId) " +
    "VALUES (UUID(), ?, ?, ?, ?)";
/**
 * retrieve goalmodel name list of a given project
 * @type {string}
 */
/**
 * The sql query to retrieve all goalmodels under a project
 * @type {string}
 */
const SQL_RET_GOALMODEL_OF_PROJ = "SELECT ModelName " +
    "FROM Project LEFT JOIN GoalModel\n" +
    "ON Project.ProjectId = GoalModel.ProjectId\n" +
    "WHERE Project.ProjectId = ?;";
/**
 * The SQL sentence to create a goalmodel
 * @type {string}
 */
const SQL_CREATE_GOALMODEL = "INSERT INTO GoalModel (ModelId,ModelName, ModelDescription, FilePath, ProjectId) " +
    "VALUES (UUID(), ?, ?, ?, ?)";
const SQL_RET_GOALMODEL = "SELECT * FROM GoalModel WHERE BINARY ModelName = ? AND ProjectId = ?";
/**
 * get all project and its corresponding goalmodels
 * @type {string}
 */
const SQL_GET_PROJ_GOALMODEL = "SELECT * " +
    "FROM GoalModel AS GM INNER JOIN User_Project AS UP INNER JOIN Project " +
    "ON UP.ProjectId = GM.ProjectId AND UP.ProjectId = Project.ProjectId " +
    "WHERE UserId = ?";

const SQL_GET_GOALMODEL_BY_ID = "SELECT GoalModel.*, Project.OwnerId " +
    "FROM GoalModel INNER JOIN Project " +
    "WHERE ModelId = ? AND GoalModel.ProjectId = Project.ProjectId";

const SQL_UPDATE_PROJECT = "UPDATE Project " +
    "SET ProjectName = ?, ProjectDescription = ?, size = ?" +
    "WHERE ProjectId = ?";

const SQL_UPDATE_GOAL_MODEL = "UPDATE GoalModel " +
    "SET ModelName = ?, ModelDescription = ?, FilePath = ?" +
    "WHERE ModelId = ?";

const SQL_GET_PROJECT = "SELECT * FROM Project WHERE ProjectId = ?";

/**
 * DBModule
 * @returns {{DBModule}}
 */
const DBModule = function () {
    let DBModule = {};
    DBModule.SUCCESS = 1;
    DBModule.ALREADY_EXIST = 0;
    DBModule.INVALID = "";
    DBModule.UNKNOWN_ERROR = -1;

    pool = mysql.createPool(dbconfig);

    /**
     * Store the information of a new project into the database
     * @param ProjectName
     * @param ProjectDescription
     * @param Size
     * @param UserId
     */
    DBModule.createProject = function (ProjectName, ProjectDescription, Size, UserId) {
        return new Promise(function (resolve, reject) {
            pool.query(
                SQL_CREATE_PROJ,
                [ProjectName, ProjectDescription, Size, UserId], function (err, result) {
                    if (err) {
                        console.log(JSON.stringify(err));
                        if (err.errno == 1062) {// MYSQL error number for duplicate entry
                            // Username already exists.
                            reject(
                                {code: DBModule.ALREADY_EXIST, message: err.sqlMessage}
                            );
                        } else {
                            reject(
                                {code: DBModule.UNKNOWN_ERROR, message: err.sqlMessage});// unknown error
                        }
                    } else {
                        // success
                        pool.query(SQL_RET_PROJECTID, [ProjectName, UserId], function (err, result) {
                            if (err) {
                                console.log(err);
                                reject(
                                    {code: DBModule.UNKNOWN_ERROR, message: err.sqlMessage});// unknown error
                            } else {
                                // success
                                resolve(result[0]);
                            }
                            // if success: return userid
                            //console.log(result);
                            //resolve(result.ProjectId);
                        });
                    }
                });

        });
    };

    /**
     * Register a user and store it into the database.
     * @param username
     * @param password
     * @param Email
     * @param FirstName
     * @param LastName
     */
    DBModule.insertUser = function (username, password, Email, FirstName, LastName) {
        return new Promise(function (resolve, reject) {
            pool.query(
                SQL_USER_REGISTER,
                [username, password, Email, FirstName, LastName], function (err, result) {
                    if (err) {
                        console.log(JSON.stringify(err));
                        if (err.errno == 1062) {// MYSQL error number for duplicate entry
                            // Username already exists.
                            reject(
                                {code: DBModule.ALREADY_EXIST, message: err.sqlMessage}
                            );
                        } else {
                            reject(
                                {code: DBModule.UNKNOWN_ERROR, message: err.sqlMessage});// unknown error
                        }
                    } else {
                        // success
                        resolve(DBModule.SUCCESS);

                    }

                });
        });
    };
    /**
     * Verify the login info in database.
     * @param username
     * @param password
     */
    DBModule.login = function (username, password) {
        return new Promise(function (resolve, reject) {
            pool.query(
                SQL_USER_LOGIN,
                [username, password], function (err, result) {
                    if (err) return reject({code: DBModule.UNKNOWN_ERROR, message: err.sqlMessage});
                    if (result.affectedRows == 1) {
                        // success
                        pool.query(SQL_RET_USERID, [username, password], function (err, result) {
                            if (err) return reject(err);
                            // if success: return userid
                            resolve(result[0].UserId);
                        });
                    } else {
                        // Invalid username or password
                        reject(DBModule.INVALID);
                    }
                })
        });
    };
    /**
     * get the project and all the goal model of a user
     * @param userid
     */
    DBModule.getProjectGoalModelList = function (userid) {
        return new Promise((resolve, reject) => {
            pool.query(SQL_GET_PROJ_GOALMODEL, [userid], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    };

    /**
     * The function to create a goal model under a project.
     * @param modelName
     * @param modelDescription
     * @param filePath
     * @param ProjectId
     */
    DBModule.createGoalModel = function (modelName, modelDescription, filePath, ProjectId) {
        return new Promise(function (resolve, reject) {
            pool.query(SQL_CREATE_GOALMODEL, [modelName, modelDescription, filePath, ProjectId], function (err, result) {
                if (err) {
                    console.log(JSON.stringify(err));
                    if (err.errno == 1062) {// MYSQL error number for duplicate entry
                        // Username already exists.
                        reject(
                            {code: DBModule.ALREADY_EXIST, message: err.sqlMessage}
                        );
                    } else {
                        reject(
                            {code: DBModule.UNKNOWN_ERROR, message: err.sqlMessage});// unknown error
                    }
                } else {
                    pool.query(SQL_RET_GOALMODEL, [modelName, ProjectId], function (err, result) {
                        if (err) {
                            console.log(err);
                            reject({code: DBModule.UNKNOWN_ERROR, message: err.sqlMessage});
                        } else {
                            // success
                            resolve(result[0]);
                        }
                        // if success: return userid
                        //console.log(result);
                        //resolve(result.ProjectId);
                    });
                }
            });
        });
    };

    /**
     * Load the goalmodel names under a given project.
     * @param ProjectId
     */
    DBModule.getGoalModelList = function (ProjectId) {
        return new Promise(function (resolve, reject) {
            pool.query(
                SQL_RET_GOALMODEL_OF_PROJ,
                [ProjectId], function (err, result) {
                    if (err) return reject({code: DBModule.UNKNOWN_ERROR, message: err.sqlMessage});
                    resolve(result);
                });
        });
    };
    /**
     * Get a goal model by its id.
     * @param ModelId
     */
    DBModule.getGoalModel = function (ModelId) {
        return new Promise((resolve, reject) => {
            pool.query(
                SQL_GET_GOALMODEL_BY_ID, [ModelId], (err, result) => {
                    if (err) return reject({code: DBModule.UNKNOWN_ERROR, message: err.sqlMessage});
                    resolve(result);
                }
            );
        });
    };

    /**
     * get a peoject by its id.
     * @param projectId
     */
    DBModule.getProject = function (projectId) {
        return new Promise((resolve, reject) => {
            pool.query(
                SQL_GET_PROJECT, [projectId], (err, result) => {
                    if (err) return reject({code: DBModule.UNKNOWN_ERROR, message: err.sqlMessage});
                    resolve(result);
                }
            );
        });
    };

    /**
     * update a single goal model.
     * @param modelId
     * @param modelName
     * @param modelDescription
     * @param filePath
     * @param ProjectId
     */
    DBModule.updateGoalModel = function (modelId, modelName, modelDescription, filePath) {
        return new Promise((resolve, reject) => {
            pool.query(SQL_UPDATE_GOAL_MODEL, [modelName, modelDescription, filePath, modelId], (err, result) => {
                if (err) return reject({code: DBModule.UNKNOWN_ERROR, message: err.sqlMessage});
                if (result.affectedRows == 1) {
                    resolve(DBModule.SUCCESS);
                } else {
                    if (err) return reject({code: DBModule.UNKNOWN_ERROR, message: err.sqlMessage});
                }
            });
        });
    };
    /**
     * update a single project.
     * @param projectId
     * @param projectName
     * @param projectDescription
     * @param size
     */
    DBModule.updateProject = function (projectId, projectName, projectDescription, size) {
        return new Promise((resolve, reject) => {
            pool.query(SQL_UPDATE_GOAL_MODEL, [projectName, projectDescription, size, projectId], (err, result) => {
                if (err) return reject({code: DBModule.UNKNOWN_ERROR, message: err.sqlMessage});
                if (result.affectedRows == 1) {
                    resolve(DBModule.SUCCESS);
                } else {
                    if (err) return reject({code: DBModule.UNKNOWN_ERROR, message: err.sqlMessage});
                }
            });
        });
    };

    return DBModule;
};

module.exports = DBModule();
