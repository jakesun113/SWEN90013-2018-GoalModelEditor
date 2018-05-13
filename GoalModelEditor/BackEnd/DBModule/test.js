// The playground for DB subteam self-proposed tests

var dbModule = require('./DBModule')('dev');

console.log(dbModule);

dbModule.insertUser('username', 'password', 'email', 'FirstName', 'LastName').then(res => {
    console.log(res);
    dbModule.getProjectGoalModelList('e06cd02b-4df4-11e8-8c21-02388973fed8').then(res1 => {
        console.log(res1);
    });
});
