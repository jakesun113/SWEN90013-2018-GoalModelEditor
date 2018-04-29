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


var dbConn = {};
dbConn.insertUser = function (username, password, Email, FirstName, LastName) {
    var connection = mysql.createConnection(dbconf);
    return new Promise(function (resolve, reject) {
        connection.query(
            SQL_USER_REGISTER,
            [username, password, Email, FirstName, LastName], function (err, result) {
                connection.end();
                if (err) {
                    console.log(JSON.stringify(err));
                    if(err.errno == 1062){
                        resolve(0);
                    }else{
                        reject(err.errno);
                    }
                };
                // success
                resolve(1);
            });
    });
}

dbConn.login = function (username, password) {
    var connection = mysql.createConnection(dbconf);
    return new Promise(function (resolve, reject) {
        connection.query(
            SQL_USER_LOGIN,
            [username, password], function (err, result) {
                connection.end();
                if (err) return reject(err);
                if (result.affectedRows == 1) {
                    resolve(1);
                } else {
                    resolve(0);
                }
            })
    });
}


// console.log('before/after?');
// dbConn.insertUser('qwe2', '123456', 'asd', 'aa', 'bb').then(function (result) {
//     console.log(result);
// });

// dbConn.login('qweqwe2','123456').then(function (result) {
//     console.log(result);
// });

module.exports = dbConn;