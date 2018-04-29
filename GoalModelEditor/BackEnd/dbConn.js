var mysql = require('mysql');
var http = require('http');

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

var SQL_USER_LOGIN = "UPDATE user SET LastLogin = NOW()" +
    "WHERE Username = ? AND Password = ?";


var dbConn = {};
dbConn.insertUser = function (username, password, Email, FirstName, LastName) {
    var connection = mysql.createConnection(dbconf);
    connection.query(
        SQL_USER_REGISTER,
        [username, password, Email, FirstName, LastName], function (err, result) {
            if (err) throw err;
            connection.end();
            console.log("connection ended\n");
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
// module.exports = dbConn;

dbConn.insertUser('qweqwe','123456','asd','aa','bb');
