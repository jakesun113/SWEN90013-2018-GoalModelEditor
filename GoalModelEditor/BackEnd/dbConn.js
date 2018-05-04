var mysql = require('mysql');
var Promise = require('bluebird');

var dbconf = {
    host: 'ec2-52-65-15-37.ap-southeast-2.compute.amazonaws.com',
    user: 'test',
    password: 'SWEN90013goal!',
    database: 'GoalModel_A'
};
/**
 * The SQL sentence to insert a user with fields escaped;
 * @type {string}
 */
var SQL_USER_REGISTER = "INSERT INTO " +
    "User (UserId, Username, Password, Email, FirstName, LastName, SignupTime, LastLogin) " +
    "VALUES (UUID(), ?, ?, ?, ?, ?, NOW(), NOW())";
/**
 * The SQL sentence to check user name and password and update the LastLogin field;
 * @type {string}
 */
var SQL_USER_LOGIN = "UPDATE User SET LastLogin = NOW()" +
    "WHERE Username = ? AND Password = ?";
/**
 *
 * @type {string}
 */
var SQL_RET_USERID = "SELECT UserId from User WHERE Username = ? AND Password = ?";

var SQL_RET_PROJECTID = "SELECT ProjectId from Project WHERE ProjectName = ? AND OwnerId = ?";

var SQL_Project_Creation = "INSERT INTO " +
    "Project (ProjectId, ProjectName, ProjectDescription, LastModified, Size,OwnerId) " +
    "VALUES (UUID(), ?, ?, NOW(), ?,?)";

var SQL_RET_GOALMODEL_OF_PROJ = "SELECT ModelName " +
    "FROM Project LEFT JOIN GoalModel\n" +
    "On Project.ProjectId = GoalModel.ProjectId\n" +
    "WHERE Project.ProjectId = ?;";


var dbConn = {};

dbConn.REG_SUCCESS = 1;
dbConn.REG_ALREADY_EXIST = 0;

// dbConn.LOGIN_SUCCESS = 1;
dbConn.LOGIN_INVALID = "";

dbConn.CreatProject_SUCCESS = 1;
/**
 * Store the information of a new project into the database
 * @param ProjectName
 * @param ProjectDescription
 * @param Size
 * @param UserId
 */
dbConn.createProject = function (ProjectName, ProjectDescription, Size, UserId) {
    var connection = mysql.createConnection(dbconf);
    return new Promise(function (resolve, reject) {
        connection.query(
            SQL_Project_Creation,
            [ProjectName, ProjectDescription, Size, UserId], function (err, result) {

                if (err) {
                    console.log(JSON.stringify(err));
                    reject(err);
                } else {
                    // success
                    connection.query(SQL_RET_PROJECTID, [ProjectName, UserId], function (err, result) {
                        if (err) return reject(err);
                        // if success: return userid
                        resolve(result[0].ProjectId);
                        //console.log(result);
                        //resolve(result.ProjectId);
                    });
                }
                connection.end();
            });

    });
}
/**
 * Register a user and store it into the database.
 * @param username
 * @param password
 * @param Email
 * @param FirstName
 * @param LastName
 */
dbConn.insertUser = function (username, password, Email, FirstName, LastName) {
    var connection = mysql.createConnection(dbconf);
    return new Promise(function (resolve, reject) {
        connection.query(
            SQL_USER_REGISTER,
            [username, password, Email, FirstName, LastName], function (err, result) {
                connection.end();
                if (err) {
                    console.log(JSON.stringify(err));
                    if (err.errno == 1062) {
                        // Username already exists.
                        resolve(dbConn.REG_ALREADY_EXIST);
                    } else {
                        reject(err.errno);
                    }
                } else {
                    // success
                    resolve(dbConn.REG_SUCCESS);

                }

            });
    });
}
/**
 * Verify the login info in database.
 * @param username
 * @param password
 */
dbConn.login = function (username, password) {
    var connection = mysql.createConnection(dbconf);
    return new Promise(function (resolve, reject) {
        connection.query(
            SQL_USER_LOGIN,
            [username, password], function (err, result) {
                if (err) return reject(err);
                if (result.affectedRows == 1) {
                    // success
                    connection.query(SQL_RET_USERID, [username, password], function (err, result) {
                        if (err) return reject(err);
                        // if success: return userid
                        resolve(result[0].UserId);
                    });
                } else {
                    // Invalid username or password
                    resolve(dbConn.LOGIN_INVALID);
                }

                connection.end();
            })
    });
}
/**
 * Load the goalmodel names under a given project.
 * @param ProjectId
 */
dbConn.getGoalModelList = function(ProjectId) {
    var connection = mysql.createConnection(dbconf);
    return new Promise(function (resolve, reject) {
        connection.query(
            SQL_RET_GOALMODEL_OF_PROJ,
            [ProjectId], function (err, result) {
                connection.end();
                if (err) return reject(err);
                console.log(result);
            })
    });
}


module.exports = dbConn;
dbConn.getGoalModelList('70edb3aa-4b83-11e8-8c21-02388973fed8').then((res)=>{
    console.log(res);
});

