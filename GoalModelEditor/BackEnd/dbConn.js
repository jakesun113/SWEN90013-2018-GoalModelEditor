var mysql = require('mysql');
var Promise = require('bluebird');

var dbconf = {
    host: 'ec2-52-65-15-37.ap-southeast-2.compute.amazonaws.com',
    user: 'test',
    password: 'SWEN90013goal!',
    database: 'GoalModel_A'
};

var SQL_USER_REGISTER = "INSERT INTO " +
    "User (UserId, Username, Password, Email, FirstName, LastName, SignupTime, LastLogin) " +
    "VALUES (UUID(), ?, ?, ?, ?, ?, NOW(), NOW())";
// var SQL_USER_LOGIN = "SELECT Username, Password FROM user where Username = ? AND Password = ?";

var SQL_USER_LOGIN = "UPDATE User SET LastLogin = NOW()" +
    "WHERE Username = ? AND Password = ?";

var SQL_RET_USERID = "SELECT UserId from User WHERE Username = ? AND Password = ?";

var SQL_RET_PROJECTID = "SELECT ProjectId from Project WHERE ProjectName = ? AND OwnerId = ?";

var SQL_Project_Creation= "INSERT INTO " +
    "Project (ProjectId, ProjectName, ProjectDescription, LastModified, Size,OwnerId) " +
    "VALUES (UUID(), ?, ?, NOW(), ?,?)";




var dbConn = {};

dbConn.REG_SUCCESS = 1;
dbConn.REG_ALREADY_EXIST = 0;

// dbConn.LOGIN_SUCCESS = 1;
dbConn.LOGIN_INVALID = "";

dbConn.CreatProject_SUCCESS=1;

dbConn.createProject = function ( ProjectName, ProjectDescription, Size, UserId) {
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

dbConn.login = function (username, password) {
    var connection = mysql.createConnection(dbconf);
    return new Promise(function (resolve, reject) {
        connection.query(
            SQL_USER_LOGIN,
            [username, password], function (err, result) {
                if (err) return reject(err);
                if (result.affectedRows == 1) {
                    // success
                    connection.query(SQL_RET_USERID,[username, password],function(err,result){
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


module.exports = dbConn;
// dbConn.login('qweqwe','123456').then((res)=>{
//     console.log(res);
// });

//dbConn.createProject('ProjectName55', 'ProjectDescription2', '88', '0aa452d7-4b67-11e8-8c21-02388973fed8').then((res)=>{
//     console.log(res);
// });