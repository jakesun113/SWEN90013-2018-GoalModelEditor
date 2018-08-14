"use strict";
const mysql = require("mysql");
const Promise = require("bluebird");

const dbconfig = require("./dbconfig.json");

let pool = null;

/**
 * The SQL sentence to insert a user with fields escaped;
 * @type {string}
 */

const SQL_USER_REGISTER =
    "INSERT INTO " +
    "User (UserId, Username, Password, Email, FirstName, LastName, SignupTime, LastLogin) " +
    "VALUES (UUID(), ?, ?, ?, ?, ?, NOW(), NOW())";
/**
 * The SQL sentence to check user name and password and update the LastLogin
 * field;
 * @type {string}
 */
const SQL_USER_LOGIN =
    "UPDATE User SET LastLogin = NOW()" +
    "WHERE BINARY Username = ? AND Password = ?";
/**
 * The SQL sentence to retrieve userid
 * @type {string}
 */
const SQL_RET_USERID =
    "SELECT UserId from User WHERE BINARY Username = ? AND Password = ?";
/**
 * The SQL sentence to retrieve projectid
 * @type {string}
 */
const SQL_RET_PROJECTID =
    "SELECT * from Project WHERE BINARY ProjectName = ? AND OwnerId = ?";
/**
 * The SQL sentence to create a project
 * @type {string}
 */
const SQL_CREATE_PROJ =
    "INSERT INTO " +
    "Project (ProjectId, ProjectName, ProjectDescription, Size, OwnerId) " +
    "VALUES (UUID(), ?, ?, ?, ?)";

/**
 * The sql query to retrieve all goalmodels under a project
 * @type {string}
 */
const SQL_RET_GOALMODEL_OF_PROJ =
    "SELECT ModelName " +
    "FROM Project LEFT JOIN GoalModel\n" +
    "ON Project.ProjectId = GoalModel.ProjectId\n" +
    "WHERE Project.ProjectId = ?";
/**
 * The SQL sentence to create a goalmodel
 * @type {string}
 */
const SQL_CREATE_GOALMODEL =
    "INSERT INTO GoalModel (ModelId,ModelName, ModelDescription, FilePath, ProjectId) " +
    "VALUES (UUID(), ?, ?, ?, ?)";

const SQL_RET_GOALMODEL =
    "SELECT * FROM GoalModel WHERE BINARY ModelName = ? AND ProjectId = ?";

const SQL_RET_MODEL = " SELECT * FROM GoalModel WHERE ModelId = ? ";
/**
 * get all project and its corresponding goalmodels
 * @type {string}
 */
const SQL_GET_PROJ_GOALMODEL =
    "SELECT * " +
    "FROM Project INNER JOIN User_Project AS UP " +
    "ON  UP.ProjectId = Project.ProjectId " +
    "LEFT JOIN GoalModel AS GM " +
    "ON UP.ProjectId = GM.ProjectId " +
    "WHERE UserId = ?";
/**
 * Get information of a goal model by its id
 * @type {string}
 */
const SQL_GET_GOALMODEL_BY_ID =
    "SELECT GoalModel.*, Project.OwnerId " +
    "FROM GoalModel INNER JOIN Project " +
    "WHERE ModelId = ? AND GoalModel.ProjectId = Project.ProjectId";
/**
 * update a project's fields
 * @type {string}
 */
const SQL_UPDATE_PROJECT =
    "UPDATE Project " +
    "SET ProjectName = ?, ProjectDescription = ?, size = ? " +
    "WHERE ProjectId = ?";

/**
 * Update a goal model
 * @type {string}
 */
const SQL_UPDATE_GOAL_MODEL =
    "UPDATE GoalModel " +
    "SET ModelName = ?, ModelDescription = ?, FilePath = ?, LastModified = NOW() " +
    "WHERE ModelId = ?";
/**
 * Get the information of a project
 * @type {string}
 */
const SQL_GET_PROJECT = "SELECT * FROM Project WHERE ProjectId = ?";
/**
 * Get a user's profile by his id.
 * @type {string}
 */
const SQL_GET_USER_PROFILE =
    "SELECT UserName, FirstName, LastName, Email FROM User WHERE UserId = ?";
/**
 * Change a user's password using his id and current password
 * @type {string}
 */
const SQL_CHANGE_USER_PASSWORD =
    "UPDATE User " + "SET Password = ? " + "WHERE UserId = ? AND Password = ?";
/**
 * update a user's profile
 * @type {string}
 */
const SQL_UPDATE_USER_PROFILE =
    "UPDATE User " +
    "SET FirstName = ?, LastName = ?, Email = ? " +
    "WHERE UserId = ?";
/**
 * Delete a GoalModel
 * @type {string}
 */
const SQL_DELETE_GOAL_MODEL = "DELETE FROM GoalModel WHERE ModelId = ?";
/**
 *  Delete a
 * @type {string}
 */
const SQL_DELETE_PROJECT = "DELETE FROM Project WHERE ProjectId = ?";
/**
 * DBModule
 * @returns {{DBModule}}
 */

const SQL_CHECK_PRIORITY_ON_PROJECT =
    "SELECT Priority FROM GoalModel_A.User_Project " +
    "WHERE UserId = ? AND ProjectId = ?";

const SQL_CHECK_PRIORITY_ON_GOALMODEL =
    "SELECT User_Project.Priority FROM" +
    " User_Project " +
    "INNER JOIN GoalModel ON User_Project.projectId = GoalModel.ProjectId" +
    " where User_Project.UserId = ? AND GoalModel.ModelId = ?";

const DBModule = function() {
    let DBModule = {};
    DBModule.SUCCESS = 1;
    DBModule.ALREADY_EXIST = 0;
    DBModule.INVALID = "";
    DBModule.UNKNOWN_ERROR = -1;
    DBModule.ACCESS_DENIED = -2;
    DBModule.MESSAGE_ACCESS_DENIED =
        "You don't have the right to do so. Please contact your project manager.";

    pool = mysql.createPool(dbconfig);

    /**
     * Store the information of a new project into the database
     * @param ProjectName
     * @param ProjectDescription
     * @param Size
     * @param UserId
     */
    DBModule.createProject = function(
        ProjectName,
        ProjectDescription,
        Size,
        UserId
    ) {
        return new Promise(function(resolve, reject) {
            pool.query(
                SQL_CREATE_PROJ,
                [ProjectName, ProjectDescription, Size, UserId],
                function(err, result) {
                    if (err) {
                        console.log(JSON.stringify(err));
                        if (err.errno == 1062) {
                            // MYSQL error number for duplicate entry
                            // Username already exists.
                            reject({
                                code: DBModule.ALREADY_EXIST,
                                message: err.sqlMessage
                            });
                        } else {
                            reject({
                                code: DBModule.UNKNOWN_ERROR,
                                message: err.sqlMessage
                            }); // unknown error
                        }
                    } else {
                        // success
                        pool.query(
                            SQL_RET_PROJECTID,
                            [ProjectName, UserId],
                            function(err, result) {
                                if (err) {
                                    console.log(err);
                                    reject({
                                        code: DBModule.UNKNOWN_ERROR,
                                        message: err.sqlMessage
                                    }); // unknown error
                                } else {
                                    // success
                                    resolve(result[0]);
                                }
                                // if success: return userid
                                //console.log(result);
                                //resolve(result.ProjectId);
                            }
                        );
                    }
                }
            );
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
    DBModule.insertUser = function(
        username,
        password,
        Email,
        FirstName,
        LastName
    ) {
        return new Promise(function(resolve, reject) {
            pool.query(
                SQL_USER_REGISTER,
                [username, password, Email, FirstName, LastName],
                function(err, result) {
                    if (err) {
                        console.log(JSON.stringify(err));
                        // MYSQL error number for duplicate entry
                        if (err.errno == 1062) {
                            // Username already exists.
                            reject({
                                code: DBModule.ALREADY_EXIST,
                                message: err.sqlMessage
                            });
                        } else {
                            reject({
                                code: DBModule.UNKNOWN_ERROR,
                                message: err.sqlMessage
                            }); // unknown error
                        }
                    } else {
                        // success
                        resolve(DBModule.SUCCESS);
                    }
                }
            );
        });
    };
    /**
     * Verify the login info in database.
     * @param username
     * @param password
     */
    DBModule.login = function(username, password) {
        return new Promise(function(resolve, reject) {
            pool.query(SQL_USER_LOGIN, [username, password], function(
                err,
                result
            ) {
                if (err) {
                    return reject({
                        code: DBModule.UNKNOWN_ERROR,
                        message: err.sqlMessage
                    });
                }
                if (result.affectedRows == 1) {
                    // success
                    pool.query(SQL_RET_USERID, [username, password], function(
                        err,
                        result
                    ) {
                        if (err) {
                            return reject(err);
                        }
                        // if success: return userid
                        resolve(result[0].UserId);
                    });
                } else {
                    // Invalid username or password
                    reject(DBModule.INVALID);
                }
            });
        });
    };
    /**
     * get the project and all the goal model of a user
     * @param userid
     */
    DBModule.getProjectGoalModelList = function(userid) {
        return new Promise((resolve, reject) => {
            pool.query(SQL_GET_PROJ_GOALMODEL, [userid], (err, result) => {
                if (err) {
                    return reject(err);
                }
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
    DBModule.createGoalModel = function(
        modelName,
        modelDescription,
        filePath,
        ProjectId
    ) {
        return new Promise(function(resolve, reject) {
            pool.query(
                SQL_CREATE_GOALMODEL,
                [modelName, modelDescription, filePath, ProjectId],
                function(err, result) {
                    if (err) {
                        console.log(JSON.stringify(err));
                        // MYSQL error number for duplicate entry
                        if (err.errno == 1062) {
                            // Username already exists.
                            reject({
                                code: DBModule.ALREADY_EXIST,
                                message: err.sqlMessage
                            });
                        } else {
                            reject({
                                code: DBModule.UNKNOWN_ERROR,
                                message: err.sqlMessage
                            }); // unknown error
                        }
                    } else {
                        pool.query(
                            SQL_RET_GOALMODEL,
                            [modelName, ProjectId],
                            function(err, result) {
                                if (err) {
                                    console.log(err);
                                    reject({
                                        code: DBModule.UNKNOWN_ERROR,
                                        message: err.sqlMessage
                                    });
                                } else {
                                    // success
                                    resolve(result[0]);
                                }
                            }
                        );
                    }
                }
            );
        });
    };

    // /**
    //  * Load the goalmodel names under a given project.WARNING: Unsafe, just
    // for reference * @param ProjectId */ DBModule.getGoalModelListUnsafe =
    // function (ProjectId) { throw "Unsafe method"; return new
    // Promise(function (resolve, reject) { pool.query(
    // SQL_RET_GOALMODEL_OF_PROJ, [ProjectId], function (err, result) { if
    // (err) return reject({code: DBModule.UNKNOWN_ERROR, message:
    // err.sqlMessage}); resolve(result); }); }); };

    /**
     * checks the user priority and load the goal models under a given project.
     * @param UserId
     * @param ProjectId
     */
    DBModule.getGoalModelList = function(UserId, ProjectId) {
        return new Promise((resolve, reject) => {
            pool.getConnection(function(err, connection) {
                connection.query(
                    SQL_CHECK_PRIORITY_ON_PROJECT,
                    [UserId, ProjectId],
                    (err, result) => {
                        if (err) {
                            // network connection or other errors
                            connection.release();
                            return reject({
                                code: DBModule.UNKNOWN_ERROR,
                                message: err.sqlMessage
                            });
                        }
                        if (result.length === 0) {
                            // No priority on the project
                            connection.release();
                            return reject({
                                code: DBModule.ACCESS_DENIED,
                                message: DBModule.MESSAGE_ACCESS_DENIED
                            });
                        } else if (result.length === 1) {
                            connection.query(
                                SQL_RET_GOALMODEL_OF_PROJ,
                                [ProjectId],
                                function(err, result) {
                                    connection.release();
                                    if (err) {
                                        return reject({
                                            code: DBModule.UNKNOWN_ERROR,
                                            message: err.sqlMessage
                                        });
                                    }
                                    resolve(result);
                                }
                            );
                        }
                    }
                );
            });
        });
    };

    /**
     * get a project by its id.
     * @param projectId
     */
    DBModule.getProject = function(projectId) {
        return new Promise((resolve, reject) => {
            pool.query(SQL_GET_PROJECT, [projectId], (err, result) => {
                if (err) {
                    return reject({
                        code: DBModule.UNKNOWN_ERROR,
                        message: err.sqlMessage
                    });
                }
                resolve(result[0]);
            });
        });
    };

    /**
     * Get a goal model by its id.
     * @param ModelId
     */
    DBModule.getGoalModel = function(ModelId) {
        return new Promise((resolve, reject) => {
            pool.query(SQL_GET_GOALMODEL_BY_ID, [ModelId], (err, result) => {
                if (err) {
                    return reject({
                        code: DBModule.UNKNOWN_ERROR,
                        message: err.sqlMessage
                    });
                }
                resolve(result[0]);
            });
        });
    };

    /**
     * update a single project.
     * @param userId
     * @param projectId
     * @param projectName
     * @param projectDescription
     * @param size
     */
    DBModule.updateProject = function(
        userId,
        projectId,
        projectName,
        projectDescription,
        size
    ) {
        return new Promise((resolve, reject) => {
            pool.getConnection(function(err, connection) {
                connection.query(
                    SQL_CHECK_PRIORITY_ON_PROJECT,
                    [userId, projectId],
                    (err, result) => {
                        if (err) {
                            // network connection or other errors
                            connection.release();
                            return reject({
                                code: DBModule.UNKNOWN_ERROR,
                                message: err.sqlMessage
                            });
                        }
                        if (result.length === 0) {
                            // No priority on the project
                            connection.release();
                            return reject({
                                code: DBModule.ACCESS_DENIED,
                                message: DBModule.MESSAGE_ACCESS_DENIED
                            });
                        } else if (result.length === 1) {
                            connection.query(
                                SQL_UPDATE_PROJECT,
                                [
                                    projectName,
                                    projectDescription,
                                    size,
                                    projectId
                                ],
                                (err, result) => {
                                    connection.release();
                                    if (err) {
                                        console.log(err);
                                        if ((err.errno = 1062)) {
                                            console.log("dup");
                                            return reject({
                                                code: DBModule.ALREADY_EXIST,
                                                message: err.sqlMessage
                                            });
                                        } else {
                                            return reject({
                                                code: DBModule.UNKNOWN_ERROR,
                                                message: err.sqlMessage
                                            });
                                        }
                                    }
                                    if (result.affectedRows == 1) {
                                        return resolve({
                                            project_name: projectName
                                        });
                                    } else {
                                        return reject({
                                            code: DBModule.INVALID,
                                            message: result.message
                                        });
                                    }
                                }
                            );
                        }
                    }
                );
            });
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
    DBModule.updateGoalModel = function(
        userId,
        modelId,
        modelName,
        modelDescription,
        filePath
    ) {
        return new Promise((resolve, reject) => {
            pool.getConnection(function(err, connection) {
                connection.query(
                    SQL_CHECK_PRIORITY_ON_GOALMODEL,
                    [userId, modelId],
                    (err, result) => {
                        if (err) {
                            // network connection or other errors
                            connection.release();
                            return reject({
                                code: DBModule.UNKNOWN_ERROR,
                                message: err.sqlMessage
                            });
                        }
                        if (result.length === 0) {
                            // No priority on the project
                            connection.release();
                            return reject({
                                code: DBModule.ACCESS_DENIED,
                                message: DBModule.MESSAGE_ACCESS_DENIED
                            });
                        } else if (result.length === 1) {
                            connection.query(
                                SQL_UPDATE_GOAL_MODEL,
                                [
                                    modelName,
                                    modelDescription,
                                    filePath,
                                    modelId
                                ],
                                (err, result) => {
                                    if (err) {
                                        connection.release();
                                        console.log(err);
                                        if ((err.errno = 1062)) {
                                            console.log("dup");
                                            return reject({
                                                code: DBModule.ALREADY_EXIST,
                                                message: err.sqlMessage
                                            });
                                        } else {
                                            return reject({
                                                code: DBModule.UNKNOWN_ERROR,
                                                message: err.sqlMessage
                                            });
                                        }
                                    }

                                    if (result.affectedRows == 1) {
                                        // success
                                        //resolve(result);
                                        connection.query(
                                            SQL_RET_MODEL,
                                            [modelId],
                                            function(err, result) {
                                                connection.release();
                                                if (err) {
                                                    console.log(err);
                                                    return reject({
                                                        code:
                                                            DBModule.UNKNOWN_ERROR,
                                                        message: err.sqlMessage
                                                    }); // unknown error
                                                } else {
                                                    // success
                                                    return resolve({
                                                        model_name:
                                                            result[0].ModelName,
                                                        last_modified:
                                                            result[0]
                                                                .LastModified
                                                    });
                                                }
                                            }
                                        );
                                    } else {
                                        connection.release();
                                        return reject({
                                            code: DBModule.INVALID,
                                            message: result.message
                                        });
                                    }
                                }
                            );
                        }
                    }
                );
            });
        });
    };

    /**
     * Get the user profiles by id.
     * @param UserId
     */
    DBModule.getUserProfile = function(UserId) {
        return new Promise((resolve, reject) => {
            pool.query(SQL_GET_USER_PROFILE, [UserId], (err, result) => {
                if (err) {
                    return reject({
                        code: DBModule.UNKNOWN_ERROR,
                        message: err.sqlMessage
                    });
                }
                resolve(result[0]);
            });
        });
    };

    /**
     * change the password of a user.
     * @param UserId
     * @param OldPassword
     * @param NewPassword
     */
    DBModule.changePassword = function(UserId, OldPassword, NewPassword) {
        return new Promise((resolve, reject) => {
            pool.query(
                SQL_CHANGE_USER_PASSWORD,
                [NewPassword, UserId, OldPassword],
                (err, result) => {
                    if (err) {
                        return reject({
                            code: DBModule.UNKNOWN_ERROR,
                            message: err.sqlMessage
                        });
                    }
                    console.log(result);
                    if (result.affectedRows == 1) {
                        resolve(DBModule.SUCCESS);
                    } else {
                        reject({
                            code: DBModule.INVALID,
                            message: result.message
                        });
                    }
                }
            );
        });
    };

    /**
     * update a user's profile
     * @param UserId
     * @param FirstName
     * @param LastName
     * @param Email
     */
    DBModule.updateUserProfile = function(UserId, FirstName, LastName, Email) {
        return new Promise((resolve, reject) => {
            pool.query(
                SQL_UPDATE_USER_PROFILE,
                [FirstName, LastName, Email, UserId],
                (err, result) => {
                    if (err) {
                        return reject({
                            code: DBModule.UNKNOWN_ERROR,
                            message: err.sqlMessage
                        });
                    }
                    if (result.affectedRows == 1) {
                        resolve(DBModule.SUCCESS);
                    } else {
                        if (err) {
                            return reject({
                                code: DBModule.UNKNOWN_ERROR,
                                message: err.sqlMessage
                            });
                        }
                        reject({
                            code: DBModule.INVALID,
                            message: result.message
                        });
                    }
                }
            );
        });
    };

    /**
     * Delete a goalmodel
     * @param userId
     * @param modelId
     */
    DBModule.deleteGoalModel = function(userId, modelId) {
        return new Promise((resolve, reject) => {
            pool.getConnection(function(err, connection) {
                connection.query(
                    SQL_CHECK_PRIORITY_ON_GOALMODEL,
                    [userId, modelId],
                    (err, result) => {
                        if (err) {
                            // network connection or other errors
                            connection.release();
                            return reject({
                                code: DBModule.UNKNOWN_ERROR,
                                message: err.sqlMessage
                            });
                        }
                        if (result.length === 0) {
                            // No priority on the project
                            connection.release();
                            return reject({
                                code: DBModule.ACCESS_DENIED,
                                message: DBModule.MESSAGE_ACCESS_DENIED
                            });
                        } else if (result.length === 1) {
                            pool.query(
                                SQL_DELETE_GOAL_MODEL,
                                [modelId],
                                (err, result) => {
                                    connection.release();
                                    if (err) {
                                        return reject({
                                            code: DBModule.UNKNOWN_ERROR,
                                            message: err.sqlMessage
                                        });
                                    }
                                    if (result.affectedRows == 1) {
                                        resolve(DBModule.SUCCESS);
                                    } else {
                                        if (err) {
                                            return reject({
                                                code: DBModule.UNKNOWN_ERROR,
                                                message: err.sqlMessage
                                            });
                                        }
                                        reject({
                                            code: DBModule.INVALID,
                                            message: result.message
                                        });
                                    }
                                }
                            );
                        }
                    }
                );
            });
        });
    };

    /**
     * delete a project
     * @param userId
     * @param projectId
     */
    DBModule.deleteProject = function(userId, projectId) {
        return new Promise((resolve, reject) => {
            pool.getConnection(function(err, connection) {
                connection.query(
                    SQL_CHECK_PRIORITY_ON_PROJECT,
                    [userId, projectId],
                    (err, result) => {
                        if (err) {
                            // network connection or other errors
                            connection.release();
                            return reject({
                                code: DBModule.UNKNOWN_ERROR,
                                message: err.sqlMessage
                            });
                        }
                        if (result.length === 0) {
                            // No priority on the project
                            connection.release();
                            return reject({
                                code: DBModule.ACCESS_DENIED,
                                message: DBModule.MESSAGE_ACCESS_DENIED
                            });
                        } else if (result.length === 1) {
                            pool.query(
                                SQL_DELETE_PROJECT,
                                [projectId],
                                (err, result) => {
                                    if (err) {
                                        return reject({
                                            code: DBModule.UNKNOWN_ERROR,
                                            message: err.sqlMessage
                                        });
                                    }
                                    if (result.affectedRows == 1) {
                                        resolve(DBModule.SUCCESS);
                                    } else {
                                        if (err) {
                                            return reject({
                                                code: DBModule.UNKNOWN_ERROR,
                                                message: err.sqlMessage
                                            });
                                        }
                                        reject({
                                            code: DBModule.INVALID,
                                            message: result.message
                                        });
                                    }
                                }
                            );
                        }
                    }
                );
            });
        });
    };
    return DBModule;
};

module.exports = DBModule();
