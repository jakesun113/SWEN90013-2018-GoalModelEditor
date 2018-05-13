'use strict';
const mysql = require('mysql');
const Promise = require('bluebird');

const dbconf = {
    connectionLimit: 100,
    host: 'ec2-52-65-15-37.ap-southeast-2.compute.amazonaws.com',
    user: 'test',
    password: 'SWEN90013goal!',
    database: 'GoalModel_A'
};

const pool = mysql.createPool(dbconf);
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
    "WHERE Username = ? AND Password = ?";
/**
 * The SQL sentence to retrieve userid
 * @type {string}
 */
const SQL_RET_USERID = "SELECT UserId from User WHERE Username = ? AND Password = ?";
/**
 * The SQL sentence to retrieve projectid
 * @type {string}
 */
const SQL_RET_PROJECTID = "SELECT * from Project WHERE ProjectName = ? AND OwnerId = ?";
/**
 * The SQL sentence to create a project
 * @type {string}
 */
const SQL_Project_Creation = "INSERT INTO " +
    "Project (ProjectId, ProjectName, ProjectDescription, Size, OwnerId) " +
    "VALUES (UUID(), ?, ?, ?, ?)";
/**
 * retrieve goalmodel name list of a given project
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
const SQL_CREATE_GOALMODEL = "INSERT INTO GoalModel (ModelId,ModelName, ModelDescription, URL, ProjectId) " +
    "VALUES (UUID(), ?, ?, ?, ?)";
const SQL_RET_GOALMODEL = "SELECT * FROM GoalModel WHERE ModelName = ? AND ProjectId = ?";
/**
 * get all project and its corresponding goalmodels
 * @type {string}
 */
const SQL_GET_PROJ_GOALMODEL = "SELECT * " +
    "FROM GoalModel AS GM INNER JOIN User_Project AS UP INNER JOIN Project " +
    "ON UP.ProjectId = GM.ProjectId AND UP.ProjectId = Project.ProjectId " +
    "WHERE UserId = ?";

const dbConn = {};
/**
 * The Signal values for db transaction
 * @type {number}
 */
dbConn.SUCCESS = 1;
dbConn.ALREADY_EXIST = 0;
dbConn.INVALID = "";
dbConn.UNKNOWN_ERROR = -1;

/**
 * Store the information of a new project into the database
 * @param ProjectName
 * @param ProjectDescription
 * @param Size
 * @param UserId
 */
dbConn.createProject = function (ProjectName, ProjectDescription, Size, UserId) {
    return new Promise(function (resolve, reject) {
        pool.query(
            SQL_Project_Creation,
            [ProjectName, ProjectDescription, Size, UserId], function (err, result) {
                if (err) {
                    console.log(JSON.stringify(err));
                    if (err.errno == 1062) {// MYSQL error number for duplicate entry
                        // Username already exists.
                        reject(dbConn.ALREADY_EXIST);
                    } else {
                        reject(dbConn.UNKNOWN_ERROR);// unknown error
                    }
                } else {
                    // success
                    pool.query(SQL_RET_PROJECTID, [ProjectName, UserId], function (err, result) {
                        if (err) {
                            console.log(err);
                            reject(dbConn.UNKNOWN_ERROR);
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
dbConn.insertUser = function (username, password, Email, FirstName, LastName) {
    return new Promise(function (resolve, reject) {
        pool.query(
            SQL_USER_REGISTER,
            [username, password, Email, FirstName, LastName], function (err, result) {
                if (err) {
                    console.log(JSON.stringify(err));
                    if (err.errno == 1062) {// MYSQL error number for duplicate entry
                        // Username already exists.
                        reject(dbConn.ALREADY_EXIST);
                    } else {
                        reject(dbConn.UNKNOWN_ERROR);// unknown error
                    }
                } else {
                    // success
                    resolve(dbConn.SUCCESS);

                }

            });
    });
};
/**
 * Verify the login info in database.
 * @param username
 * @param password
 */
dbConn.login = function (username, password) {
    return new Promise(function (resolve, reject) {
        pool.query(
            SQL_USER_LOGIN,
            [username, password], function (err, result) {
                if (err) return reject(err);
                if (result.affectedRows == 1) {
                    // success
                    pool.query(SQL_RET_USERID, [username, password], function (err, result) {
                        if (err) return reject(err);
                        // if success: return userid
                        resolve(result[0].UserId);
                    });
                } else {
                    // Invalid username or password
                    reject(dbConn.INVALID);
                }
            })
    });
};
/**
 * Load the goalmodel names under a given project.
 * @param ProjectId
 */
dbConn.getGoalModelList = function (ProjectId) {
    return new Promise(function (resolve, reject) {
        pool.query(
            SQL_RET_GOALMODEL_OF_PROJ,
            [ProjectId], function (err, result) {
                if (err) return reject(err);
                resolve(result);
            })
    });
};
/**
 * The function to create a goal model under a project.
 * @param modelName
 * @param modelDescription
 * @param url
 * @param ProjectId
 */
dbConn.createGoalModel = function (modelName, modelDescription, url, ProjectId) {
    return new Promise(function (resolve, reject) {
        pool.query(SQL_CREATE_GOALMODEL, [modelName, modelDescription, url, ProjectId], function (err, result) {
            if (err) {
                console.log(JSON.stringify(err));
                if (err.errno == 1062) {// MYSQL error number for duplicate entry
                    // Username already exists.
                    reject(dbConn.ALREADY_EXIST);
                } else {
                    reject(dbConn.UNKNOWN_ERROR);// unknown error
                }
            } else {
                pool.query(SQL_RET_GOALMODEL, [modelName, ProjectId], function (err, result) {
                    if (err) {
                        console.log(err);
                        reject(dbConn.UNKNOWN_ERROR);
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
 * get the project and all the goal model of a user
 * @param userid
 */
dbConn.getProjectGoalModelList = function (userid) {
    return new Promise((resolve, reject) => {
        pool.query(SQL_GET_PROJ_GOALMODEL, [userid], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

module.exports = dbConn;


// dbConn.createProject('tproj1', 'testetst', 100, '0aa452d7-4b67-11e8-8c21-02388973fed8').then(res => {
//     console.log(res);
//     pool.end();
// });
// dbConn.getProjectGoalModelList('e06cd02b-4df4-11e8-8c21-02388973fed8').then(res => {
//     console.log(res);
//     pool.end();
// });

// dbConn.createGoalModel('asdasd3','',' ','e104cd30-51fa-11e8-8c21-02388973fed8').then((res)=>{
//     console.log(res);
//     pool.end();
// });
