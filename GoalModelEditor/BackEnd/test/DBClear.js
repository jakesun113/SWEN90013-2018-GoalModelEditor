let mysql  = require('mysql');
let config = require('./DBConfig.js');

let connection = mysql.createConnection(config);

// DELETE statment
let sql1 = `DELETE FROM GoalModel`;
let sql2 = `DELETE FROM User`;
let sql3 = `DELETE FROM User_Project`;
let sql4 = `DELETE FROM Project`;

// delete a row with id 1
//connection.query(sql2, (error, results, fields) => {
//    if (error)
//        return console.error(error.message);
//});

connection.end();