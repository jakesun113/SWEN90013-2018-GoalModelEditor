// The playground for DB subteam self-proposed tests

var dbModule = require('./DBModule');

console.log(dbModule);

dbModule.insertUser('username1', 'password', 'email', 'FirstName', 'LastName').then(res => {
    console.log(res);
});
