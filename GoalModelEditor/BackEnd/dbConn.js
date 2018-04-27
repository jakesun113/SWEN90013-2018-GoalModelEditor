var mysql = require('mysql');
var http = require('http');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456root',
    database: 'GoalModel_Test'
});

var SQL_USER_REGISTER = "";
var SQL_USER_LOGIN = "";

// http.get('http://localhost:8430/', function (response) {
//     console.log(response);
// }).on('error', function (e) {
//     res.sendStatus(500);
// }).end();

DB_insert_User(username, password) {
    con.query(SQL_USER_LOGIN,[],function(){});
}

module.exports = connection;