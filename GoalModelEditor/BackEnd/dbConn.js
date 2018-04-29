var mysql = require('mysql');
var http = require('http');

var dbconf = {
    host: 'localhost',
    user: 'root',
    password: '123456root',
    database: 'GoalModel_A'
};


var SQL_USER_REGISTER = "INSERT INTO " +
    "user (UserId, Username, Password, Email, FirstName, LastName, SignupTime, LastLogin) " +
    "VALUES (UUID(), ?, ?, ?, ?, ?, NOW(), NOW())";
// var SQL_USER_LOGIN = "SELECT Username, Password FROM user where Username = ? AND Password = ?";

var SQL_USER_LOGIN = "UPDATE user SET LastLogin = NOW()" +
    "WHERE Username = ? AND Password = ?";


var dbConn = {};
dbConn.insertUser = function (username, password, Email, FirstName, LastName) {
    connection.query(
        SQL_USER_LOGIN,
        [username, password, Email, FirstName, LastNames], function (err, result) {
            if (err) throw err;
            return result;
        });
}

dbConn.login = function (username, password) {
    var connection = mysql.createConnection(dbconf);
    connection.query(
        SQL_USER_LOGIN,
        [username, password], function (err, result) {
            if (err) throw err;
            // if(result.length == 1){
            //     console.log('successj');
            // }else{
            //     console.log('wrong cred');
            // }
            if(result.affectedRows == 1){
                console.log('success');
            }else{
                console.log('wrong cred');
            }
            connection.end();
        });
}


// dbConn.login('qwe','123456');
// dbConn.login('qwe','123456asd');
module.exports = dbConn;
