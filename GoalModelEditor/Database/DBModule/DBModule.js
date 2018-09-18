"use strict";
const mysql = require("../../BackEnd/node_modules/mysql/index");
const Promise = require("../../BackEnd/node_modules/bluebird/js/release/bluebird");

const dbConfig = require("./dbConfig.json");

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
    "WHERE BINARY Username = ? AND BINARY Password = ?";
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
 * The sql query to retrieve all goal models under a project
 * @type {string}
 */
const SQL_RET_GOALMODEL_OF_PROJ =
    "SELECT ModelName " +
    "FROM Project LEFT JOIN GoalModel " +
    "ON Project.ProjectId = GoalModel.Project " +
    "WHERE BINARY Project.ProjectId = ?";
/**
 * The SQL sentence to create a goalmodel
 * @type {string}
 */
const SQL_CREATE_GOALMODEL =
    "INSERT INTO GoalModel (ModelId,ModelName, ModelDescription, DirPath, Project, Type) " +
    "VALUES (UUID(), ?, ?, ?, ?, ?)";
/**
 * The sql to retrieve a goalmodel by its name
 * @type {string}
 */
const SQL_RET_GOALMODEL =
    "SELECT * FROM GoalModel LEFT JOIN Project " +
    "ON Project.ProjectId = GoalModel.Project" +
    " WHERE BINARY ModelName = ? AND Project = ?";
/**
 * The sql to retrieve a goalmodel by id
 * @type {string}
 */
const SQL_RET_MODEL = " SELECT * FROM GoalModel WHERE ModelId = ? ";
/**
 * get all project and its corresponding goalmodels
 * @type {string}
 */

const SQL_GET_PROJ_GOALMODEL =
    "SELECT Project.*, GM.ModelId, GM.ModelName, GM.ModelDescription, " +
    "GM.DirPath, GM.LastModified, GM.GoalModelCreateTime, GM.Type " +
    "FROM Project INNER JOIN User_Project AS UP " +
    "ON  UP.ProjectId = Project.ProjectId " +
    "LEFT OUTER JOIN GoalModel AS GM " +
    "ON GM.Project = UP.ProjectId " +
    "WHERE BINARY UserId = ?";
/**
 * Get information of a goal model by its id
 * @type {string}
 */
const SQL_GET_GOALMODEL_BY_ID =
    "SELECT GoalModel.*, Project.OwnerId " +
    "FROM GoalModel INNER JOIN Project " +
    "WHERE BINARY ModelId = ? AND BINARY GoalModel.Project = Project.ProjectId";
/**
 * update a project's fields
 * @type {string}
 */
const SQL_UPDATE_PROJECT =
    "UPDATE Project " +
    "SET ProjectName = ?, ProjectDescription = ?, size = ? " +
    "WHERE BINARY ProjectId = ?";
/**
 * Update a goal model
 * @type {string}
 */
const SQL_UPDATE_GOAL_MODEL =
    "UPDATE GoalModel " +
    "SET ModelName = ?, ModelDescription = ?, DirPath = ?, LastModified = NOW() " +
    "WHERE BINARY ModelId = ?";
/**
 * Update a goal model's last odified time
 * @type {string}
 */
const SQL_UPDATE_GOAL_MODEL_TIME =
    "UPDATE GoalModel " +
    "SET LastModified = NOW() " +
    "WHERE BINARY ModelId = ?";
/**
 * Get the information of a project
 * @type {string}
 */
const SQL_GET_PROJECT = "SELECT * FROM Project WHERE BINARY ProjectId = ?";
/**
 * Get a user's profile by his id.
 * @type {string}
 */
const SQL_GET_USER_PROFILE =
    "SELECT UserName, FirstName, LastName, Email FROM User WHERE BINARY UserId = ?";
/**
 * Change a user's password using his id and current password
 * @type {string}
 */
const SQL_CHANGE_USER_PASSWORD =
    "UPDATE User " +
    "SET Password = ? " +
    "WHERE BINARY UserId = ? AND BINARY Password = ?";
/**
 * update a user's profile
 * @type {string}
 */
const SQL_UPDATE_USER_PROFILE =
    "UPDATE User " +
    "SET FirstName = ?, LastName = ?, Email = ? " +
    "WHERE BINARY UserId = ?";
/**
 * Delete a GoalModel
 * @type {string}
 */
const SQL_DELETE_GOAL_MODEL = "DELETE FROM GoalModel WHERE BINARY ModelId = ?";
/**
 *  Delete a project.
 * @type {string}
 */
const SQL_DELETE_PROJECT = "DELETE FROM Project WHERE BINARY ProjectId = ?";

const SQL_CHECK_PRIORITY_ON_PROJECT =
    "SELECT Priority FROM GoalModel_A.User_Project " +
    "WHERE BINARY UserId = ? AND BINARY ProjectId = ?";

const SQL_CHECK_PRIORITY_ON_GOALMODEL =
    "SELECT User_Project.Priority FROM" +
    " User_Project " +
    "INNER JOIN GoalModel ON User_Project.projectId = GoalModel.Project" +
    " where BINARY User_Project.UserId = ? AND BINARY GoalModel.ModelId = ?";
/**
 * Create a template
 * @type {string}
 */
const SQL_CREATE_TEMPLATE =
    "INSERT INTO Template (TemplateId, TemplateName, TemplateDescription, DirPath, User) " +
    "VALUES (UUID(), ?, ?, ?, ?)";
/**
 * Delete a template
 * @type {string}
 */
const SQL_DELETE_TEMPLATE =
    "DELETE FROM Template WHERE BINARY TemplateId = ? AND User = ?";
/**
 * Update a template
 * @type {string}
 */
const SQL_UPDATE_TEMPLATE =
    "UPDATE Template " +
    "SET TemplateName = ?, TemplateDescription = ?, DirPath = ?, LastModified = NOW() " +
    "WHERE BINARY TemplateId = ? AND BINARY User = ?";
/**
 * Update a template's time
 * @type {string}
 */
const SQL_UPDATE_TEMPLATE_TIME =
    "UPDATE Template " +
    "SET LastModified = NOW() " +
    "WHERE BINARY TemplateId = ? AND BINARY User = ?";
/**
 * return a template
 * @type {string}
 */
const SQL_RET_TEMPLATE =
    "SELECT * FROM Template WHERE BINARY TemplateName = ? AND User = ?";
/**
 * Get all templates of a user
 * @type {string}
 */
const SQL_GET_TEMPLATE_LIST =
    "SELECT * FROM Template WHERE User = ?";
/**
 * get a template by its id
 * @type {string}
 */
const SQL_GET_TEMPLATE_BY_ID =
    "SELECT * FROM Template WHERE TemplateId = ? AND User = ?";

/**
 *  Predefined MYSQL error number for duplicate entry
 * @type {number}
 */
const DUP_ENTRY = 1062;


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
    DBModule.ACCESS_DENIED = -2;
    DBModule.MESSAGE_ACCESS_DENIED =
        "You don't have the right to do so. Please contact your project manager.";

    pool = mysql.createPool(dbConfig);

    /**
     * Store the information of a new project into the database
     * @param ProjectName
     * @param ProjectDescription
     * @param Size
     * @param UserId
     */
    DBModule.createProject = function (ProjectName,
                                       ProjectDescription,
                                       Size,
                                       UserId) {
        return new Promise(function (resolve, reject) {
            pool.query(
                SQL_CREATE_PROJ,
                [ProjectName, ProjectDescription, Size, UserId],
                function (err, result) {
                    if (err) {
                        console.log(JSON.stringify(err));
                        if (err.errno === DUP_ENTRY) {
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
                        console.log(result);
                        // success
                        pool.query(
                            SQL_RET_PROJECTID,
                            [ProjectName, UserId],
                            function (err, result) {
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
    DBModule.insertUser = function (username,
                                    password,
                                    Email,
                                    FirstName,
                                    LastName) {
        return new Promise(function (resolve, reject) {
            pool.query(
                SQL_USER_REGISTER,
                [username, password, Email, FirstName, LastName],
                function (err, result) {
                    if (err) {
                        console.log(JSON.stringify(err));
                        // MYSQL error number for duplicate entry
                        if (err.errno === DUP_ENTRY) {
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
    DBModule.login = function (username, password) {
        return new Promise(function (resolve, reject) {
            pool.query(SQL_USER_LOGIN, [username, password], function (err,
                                                                       result) {
                if (err) {
                    return reject({
                        code: DBModule.UNKNOWN_ERROR,
                        message: err.sqlMessage
                    });
                }
                if (result.affectedRows === 1) {
                    // success
                    pool.query(SQL_RET_USERID, [username, password], function (err,
                                                                               result) {
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
     * @return format(if success) :  ...
     * @return format(if error) : {code:<Error Code>, message:<Error Message>}
     * @param userid
     */
    DBModule.getProjectGoalModelList = function (userid) {
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
     * @return format(if success) : <goal model DB row>
     * @return format(if error) : {code:<Error Code>, message:<Error Message>}
     * @param modelName
     * @param modelDescription
     * @param filePath
     * @param ProjectId
     */
    DBModule.createGoalModel = function (modelName,
                                         modelDescription,
                                         filePath,
                                         ProjectId, Type) {
        return new Promise(function (resolve, reject) {
            pool.query(
                SQL_CREATE_GOALMODEL,
                [modelName, modelDescription, filePath, ProjectId, Type],
                function (err, result) {
                    if (err) {
                        console.log(JSON.stringify(err));
                        // MYSQL error number for duplicate entry
                        if (err.errno === DUP_ENTRY) {
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
                            function (err, result) {
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
     * @return format(if success) : < all related goalmodels >
     * @return format(if error) : {code:<Error Code>, message:<Error Message>}
     * @param UserId
     * @param ProjectId
     */
    DBModule.getGoalModelList = function (UserId, ProjectId) {
        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, connection) {
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
                                function (err, result) {
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
     * @return format(if success) : <project DB row>
     * @return format(if error) : {code:<Error Code>, message:<Error Message>}
     * @param projectId
     */
    DBModule.getProject = function (projectId) {
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
     * @return format(if success) : <goal model DB row>
     * @return format(if error) : {code:<Error Code>, message:<Error Message>}
     * @param ModelId
     */
    DBModule.getGoalModel = function (ModelId) {
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
     * @return format(if success) : {project_name:<>}
     * @return format(if error) : {code:<Error Code>, message:<Error Message>}
     * @param userId
     * @param projectId
     * @param projectName
     * @param projectDescription
     * @param size
     */
    DBModule.updateProject = function (userId,
                                       projectId,
                                       projectName,
                                       projectDescription,
                                       size) {
        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, connection) {
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
                                        if ((err.errno = DUP_ENTRY)) {
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
                                    if (result.affectedRows === 1) {
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
     * @return format(if success) : {model_name:<>, last_modified:<>}
     * @return format(if error) : {code:<Error Code>, message:<Error Message>}
     * @param userId
     * @param modelId
     * @param modelName
     * @param modelDescription
     * @param dirPath
     */
    DBModule.updateGoalModel = function (userId,
                                         modelId,
                                         modelName,
                                         modelDescription,
                                         dirPath) {
        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, connection) {
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
                                [modelName, modelDescription, dirPath, modelId],
                                (err, result) => {
                                    if (err) {
                                        connection.release();
                                        console.log(err);
                                        if ((err.errno = DUP_ENTRY)) {
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

                                    if (result.affectedRows === 1) {
                                        // success
                                        //resolve(result);
                                        connection.query(
                                            SQL_RET_MODEL,
                                            [modelId],
                                            function (err, result) {
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
     * update a single goal model's time.
     * @return format(if success) : {model_name:<>, last_modified:<>}
     * @return format(if error) : {code:<Error Code>, message:<Error Message>}
     * @param userId
     * @param modelId
     */
    DBModule.updateGoalModelTime = function (userId, modelId) {
        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, connection) {
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
                                SQL_UPDATE_GOAL_MODEL_TIME,
                                [modelId],
                                (err, result) => {
                                    if (err) {
                                        connection.release();
                                        console.log(err);
                                        if ((err.errno = DUP_ENTRY)) {
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
                                    if (result.affectedRows === 1) {
                                        connection.query(
                                            SQL_RET_MODEL,
                                            [modelId],
                                            function (err, result) {
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
    DBModule.getUserProfile = function (UserId) {
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
     * @return format(if success) : 1
     * @return format(if error) : {code:<Error Code>, message:<Error Message>}
     * @param UserId
     * @param OldPassword
     * @param NewPassword
     */
    DBModule.changePassword = function (UserId, OldPassword, NewPassword) {
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
                    if (result.affectedRows === 1) {
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
     * update a user's profile.
     * @return format(if success) : 1
     * @return format(if error) : {code:<Error Code>, message:<Error Message>}
     * @param UserId
     * @param FirstName
     * @param LastName
     * @param Email
     */
    DBModule.updateUserProfile = function (UserId, FirstName, LastName, Email) {
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
                    if (result.affectedRows === 1) {
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
     * @return format(if success) : 1
     * @return format(if error) : {code:<Error Code>, message:<Error Message>}
     * @param userId
     * @param modelId
     */
    DBModule.deleteGoalModel = function (userId, modelId) {
        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, connection) {
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
                                    if (result.affectedRows === 1) {
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
     * delete a project with its id and userid for authentication purpose.
     * @return format(if success) : 1
     * @return format(if error) : {code:<Error Code>, message:<Error Message>}
     * @param userId
     * @param projectId
     */
    DBModule.deleteProject = function (userId, projectId) {
        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, connection) {
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
                                    if (result.affectedRows === 1) {
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
     * Delete a Template
     * @return format(if success) : 1
     * @return format(if error) : {code:<Error Code>, message:<Error Message>}
     * @param userId
     * @param TemplateId
     */
    DBModule.deleteTemplate = function (userId, templateId) {
        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, connection) {
                connection.query(
                    SQL_DELETE_TEMPLATE,
                    [templateId, userId],
                    (err, result) => {
                        if (err) {
                            // network connection or other errors
                            connection.release();
                            return reject({
                                code: DBModule.UNKNOWN_ERROR,
                                message: err.sqlMessage
                            });
                        }
                        if (result.affectedRows === 1) {
                            return resolve(DBModule.SUCCESS);
                        } else {
                            // No priority on the project or no such user
                            connection.release();
                            if (err) {// connection err
                                return reject({
                                    code: DBModule.UNKNOWN_ERROR,
                                    message: err.sqlMessage
                                });
                            }
                            return reject({ // no such template or access denied
                                code: DBModule.INVALID,
                                message: result.message
                            });
                        }
                    });
            });
        });
    }

    /**
     * The function to create a TEMPLATE under a user.
     * @return format(if success) : <template DB row>
     * @return format(if error) : {code:<Error Code>, message:<Error Message>}
     * @param templateName
     * @param templateDescription
     * @param dirPath
     * @param User
     */
    DBModule.createTemplate = function (templateName,
                                        templateDescription,
                                        dirPath,
                                        User) {
        return new Promise(function (resolve, reject) {
            pool.query(
                SQL_CREATE_TEMPLATE,
                [templateName, templateDescription, dirPath, User],
                function (err, result) {
                    if (err) {
                        console.log(JSON.stringify(err));
                        // MYSQL error number for duplicate entry
                        if (err.errno === DUP_ENTRY) {
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
                            SQL_RET_TEMPLATE,
                            [templateName, User],
                            function (err, result) {
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
    /**
     * checks the user priority and load his templates.
     * @return format(if success) : < all related templates >
     * @return format(if error) : {code:<Error Code>, message:<Error Message>}
     * @param UserId
     */
    DBModule.getTemplateList = function (UserId) {
        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, connection) {
                connection.query(
                    SQL_GET_TEMPLATE_LIST,
                    [UserId],
                    (err, result) => {
                        if (err) {
                            // network connection or other errors
                            connection.release();
                            return reject({
                                code: DBModule.UNKNOWN_ERROR,
                                message: err.sqlMessage
                            });
                        }
                        return resolve(result);
                    }
                );
            });
        });
    };
    /**
     * checks the user priority and load his templates.
     * @return format(if success) : < all related templates >
     * @return format(if error) : {code:<Error Code>, message:<Error Message>}
     * @param UserId
     */
    DBModule.getTemplate = function (UserId, TemplateId) {
        return new Promise((resolve, reject) => {
                pool.getConnection(function (err, connection) {
                    connection.query(
                        SQL_GET_TEMPLATE_BY_ID,
                        [TemplateId, UserId],
                        (err, result) => {
                            if (err) {
                                // network connection or other errors
                                connection.release();
                                return reject({
                                    code: DBModule.UNKNOWN_ERROR,
                                    message: err.sqlMessage
                                });
                            }
                            if (result.length === 1) {// success
                                return resolve(result[0]);
                            } else { //
                                return resolve({
                                    code: DBModule.INVALID,
                                    message: err.sqlMessage
                                });
                            }
                        }
                    );
                });
            }
        );
    };

    /**
     * update a single Template.
     * @return format(if success) : {model_name:<>, last_modified:<>}
     * @return format(if error) : {code:<Error Code>, message:<Error Message>}
     * @param userId
     * @param templateId
     * @param templateName
     * @param templateDescription
     * @param dirPath
     */
    DBModule.updateTemplate = function (userId,
                                        templateId,
                                        templateName,
                                        templateDescription,
                                        dirPath) {
        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, connection) {
                if (err) {
                    connection.release();
                    return reject({
                        code: DBModule.UNKNOWN_ERROR,
                        message: err.sqlMessage
                    });
                }
                connection.query(
                    SQL_UPDATE_TEMPLATE,
                    [templateName, templateDescription, dirPath, templateId, userId],
                    (err, result) => {
                        if (err) {
                            // network connection or other errors
                            connection.release();
                            return reject({
                                code: DBModule.UNKNOWN_ERROR,
                                message: err.sqlMessage
                            });
                        }
                        if (result.length === 1) {// success
                            return resolve(result);
                        } else { //
                            return resolve({
                                code: DBModule.INVALID,
                                message: "template not found"
                            });
                        }
                    }
                );

            });
        });
    };
    /**
     * update a single Template's kast modified time
     * @return format(if success) : {model_name:<>, last_modified:<>}
     * @return format(if error) : {code:<Error Code>, message:<Error Message>}
     * @param userId
     * @param templateId
     */
    DBModule.updateTemplateTime = function (userId,
                                            templateId) {
        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, connection) {
                if (err) {
                    connection.release();
                    return reject({
                        code: DBModule.UNKNOWN_ERROR,
                        message: err.sqlMessage
                    });
                }
                connection.query(
                    SQL_UPDATE_TEMPLATE_TIME,
                    [templateId, userId],
                    (err, result) => {
                        if (err) {
                            // network connection or other errors
                            connection.release();
                            return reject({
                                code: DBModule.UNKNOWN_ERROR,
                                message: err.sqlMessage
                            });
                        }
                        if (result.length === 1) {// success
                            return resolve(result);
                        } else { //
                            return resolve({
                                code: DBModule.INVALID,
                                message: "Template not found"
                            });
                        }
                    }
                );

            });
        });
    };
    /**************************************************
     * Do not change code under this line
     *************************************************/
    return DBModule;
};

module.exports = DBModule();
