// The playground for DB subteam self-proposed tests

var dbModule = require('./DBModule');


// dbModule.insertUser('username1', 'password', 'email', 'FirstName', 'LastName').then(res => {
//     // console.log(res);
// }).catch((err)=>{
//     console.log('['+err+']');
// });

dbModule.getProject('4c997a11-568b-11e8-8c21-02388973fed8').then(res => {
    console.log(res);
});

// dbModule.login().then();
