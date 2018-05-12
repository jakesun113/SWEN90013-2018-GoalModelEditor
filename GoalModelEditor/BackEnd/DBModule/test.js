// The playground for DB subteam self-proposed tests

var dbModule = require('./DBModule')('dev');

console.log(dbModule);



dbModule.getProjectGoalModelList('e06cd02b-4df4-11e8-8c21-02388973fed8').then(res => {
    console.log(res);
});