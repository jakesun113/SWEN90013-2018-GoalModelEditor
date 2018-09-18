// The playground for DB subteam self-proposed tests

var dbModule = require("./DBModule");

// dbModule.insertUser('username1', 'password', 'email', 'FirstName', 'LastName').then(res => {
//     // console.log(res);
// }).catch((err)=>{
//     console.log('['+err+']');
// });

// dbModule.getUserProfile('0aa452d7-4b67-11e8-8c21-02388973fed8').then(res => {
//     console.log(res);
// }).catch(err => {
//     console.log(err);
// });

// dbModule.getGoalModelList('uid', 'pid11').then(res => {
//     console.log(JSON.stringify(res));
//
// }).catch(err => {
//     console.log(err);
// });

// test code for updateProject function:
// dbModule.updateProject('uid', 'pid', 'projectName', 'projectDescription', '110').then(res => {
//     console.log(JSON.stringify(res));
//
// }).catch(err => {
//     console.log(err);
// });

//test code for updateGoalModel function:
// dbModule.updateGoalModel('uid11', 'mid', 'modelName', 'modelDescription','filePath').then(res => {
//     console.log(JSON.stringify(res));
//
// }).catch(err => {
//     console.log(err);
// });

//test code for create GoalModel (return "1" if success)
// dbModule.createGoalModel('modelname1', 'desc','','pid','GoalList').then(res => {
//     console.log(JSON.stringify(res));
// }).catch(err => {
//     console.log(err);
// });

//test code for deleting GoalModel (return "1" if success)
dbModule.deleteGoalModel('6acb311c-96c6-11e8-9bb4-02b330fa6e48', '634cad6d-b96c-11e8-b616-02b330fa6e48').then(res => {
    console.log(JSON.stringify(res));
}).catch(err => {
    console.log(err);
});

//test code for deleting Project(return "1" if success)
// dbModule
//     .deleteProject("uid", "pid2")
//     .then(res => {
//         console.log(JSON.stringify(res));
//     })
//     .catch(err => {
//         console.log(err);
//     });

// dbModule.login().then();

dbModule
    .getProjectGoalModelList("dbfb25a2-98a4-11e8-b616-02b330fa6e48")
    .then(res => {
        console.log(JSON.stringify(res));
    })
    .catch(err => {
        console.log(err);
    });
