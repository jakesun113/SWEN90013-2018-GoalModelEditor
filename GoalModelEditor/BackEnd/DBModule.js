var mysql = require('mysql');
var Promise = require('bluebird');

var dbconf = {
    host: 'ec2-52-65-15-37.ap-southeast-2.compute.amazonaws.com',
    user: 'test',
    password: 'SWEN90013goal!',
    database: 'GoalModel_A'
};

var pool = mysql.createPool(dbconf);

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
 * The SQL sentence to retrieve userid
 * @type {string}
 */
var SQL_RET_USERID = "SELECT UserId from User WHERE Username = ? AND Password = ?";
/**
 * The SQL sentence to retrieve projectid
 * @type {string}
 */
var SQL_RET_PROJECTID = "SELECT ProjectId from Project WHERE ProjectName = ? AND OwnerId = ?";
/**
 * The SQL sentence to create a project
 * @type {string}
 */
var SQL_Project_Creation = "INSERT INTO " +
    "Project (ProjectId, ProjectName, ProjectDescription, LastModified, Size,OwnerId) " +
    "VALUES (UUID(), ?, ?, NOW(), ?,?)";
/**
 * retrieve goalmodel name list of a given project
 * @type {string}
 */
var SQL_RET_GOALMODEL_OF_PROJ = "SELECT ModelName " +
    "FROM Project LEFT JOIN GoalModel\n" +
    "On Project.ProjectId = GoalModel.ProjectId\n" +
    "WHERE Project.ProjectId = ?;";
/**
 * The SQL sentence to create a goalmodel
 * @type {string}
 */
var SQL_CREATE_GOALMODEL = "INSERT INTO GoalModel (ModelId,ModelName,ProjectId) " +
    "VALUES (UUID(),?,?)";

/**
 * The Signal values for db transaction
 * @type {number}
 */
// dbConn.SUCCESS = 1;
// dbConn.ALREADY_EXIST = 0;
// dbConn.LOGIN_INVALID = "";
// dbConn.CreatProject_SUCCESS = 1;


function DBModule() {
    this.SUCCESS = 1;
    this.ALREADY_EXIST = 0;
    this.LOGIN_INVALID = "";
    this.CreatProject_SUCCESS = 1;
    this._connection = null;

    this.startTransaction = function () {
        this._connection = mysql.createConnection(dbconf);
    }

    this.insertUser = function (username, password, Email, FirstName, LastName) {
        if (this._connection) {
            return new Promise(function (resolve, reject) {
                this._connection.query(
                    SQL_USER_REGISTER,
                    [username, password, Email, FirstName, LastName], function (err, result) {
                        connection.end();
                        if (err) {
                            console.log(JSON.stringify(err));
                            if (err.errno == 1062) {// MYSQL error number for duplicate entry
                                // Username already exists.
                                resolve(dbConn.ALREADY_EXIST);
                            } else {
                                reject(err.errno);
                            }
                        } else {
                            // success
                            resolve(dbConn.SUCCESS);
                        }

                    });
            });
        } else {
            throw 'no Connection';
        }
    }


}


module.exports = DBModule;
// dbConn.getGoalModelList('70edb3aa-4b83-11e8-8c21-02388973fed8').then((res)=>{
//     console.log(res);
// });

