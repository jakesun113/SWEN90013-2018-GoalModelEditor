var express = require('express');
var routers = express.Router();
var integration = require('../../../api');

routers.use('/edit', require('./edit'));

/* GET user file system, send response with */
routers.get('/', function(req, res, next) {
    res.render('./user/project/filesystem');
});

/* GET user's file list */
routers.get('/files', function (req, res, next) {
    var mockup = [{
        "id":"abcdefg",
        "fileName": "abc",
        "lastModified": "2018-01-01 13:56pm",
        "owner": "me",
        "fileSize": "20k"
    },
        {
            "id":"abcdefg",
            "fileName": "abc",
            "lastModified": "2018-01-01 13:56pm",
            "owner": "me",
            "fileSize": "20k"
        },
        {
            "id":"abcdefg",
            "fileName": "abc",
            "lastModified": "2018-01-01 13:56pm",
            "owner": "me",
            "fileSize": "20k"
        },
        {
            "id":"abcdefg",
            "fileName": "abc",
            "lastModified": "2018-01-01 13:56pm",
            "owner": "me",
            "fileSize": "20k"
        },
        {
            "id":"abcdefg",
            "fileName": "abc",
            "lastModified": "2018-01-01 13:56pm",
            "owner": "me",
            "fileSize": "20k"
        },
        {
            "id":"abcdefg",
            "fileName": "abc",
            "lastModified": "2018-01-01 13:56pm",
            "owner": "me",
            "fileSize": "20k"
        },
        {
            "id":"abcdefg",
            "fileName": "abc",
            "lastModified": "2018-01-01 13:56pm",
            "owner": "me",
            "fileSize": "20k"
        },
        {
            "id":"abcdefg",
            "fileName": "abc",
            "lastModified": "2018-01-01 13:56pm",
            "owner": "me",
            "fileSize": "20k"
        },
        {
            "id":"abcdefg",
            "fileName": "abc",
            "lastModified": "2018-01-01 13:56pm",
            "owner": "me",
            "fileSize": "20k"
        },
        {
            "id":"abcdefg",
            "fileName": "abc",
            "lastModified": "2018-01-01 13:56pm",
            "owner": "me",
            "fileSize": "20k"
        },
        {
            "id":"abcdefg",
            "fileName": "abc",
            "lastModified": "2018-01-01 13:56pm",
            "owner": "me",
            "fileSize": "20k"
        },
        {
            "id":"abcdefg",
            "fileName": "abc",
            "lastModified": "2018-01-01 13:56pm",
            "owner": "me",
            "fileSize": "20k"
        },
        {
            "id":"abcdefg",
            "fileName": "abc",
            "lastModified": "2018-01-01 13:56pm",
            "owner": "me",
            "fileSize": "20k"
        }]  ;
    res.json(mockup);
});

// /* POST a new file to the server */
// // routers.post('/', integration.createProject, function(req, res, next) {
// //     console.log("100");
// //     console.log(req.specialData);
// //     res.json(req.specialData);
// // });
//
// /* Mock back-end post function - integration test */
// routers.post('/createfile', function(req, res, next) {
//     console.log(req.body);
//     var mockup = [{
//         "id":"abcdefg",
//         "fileName": req.body.fileName,
//         "lastModified": "2018-01-01 13:56pm",
//         "owner": "me",
//         "fileSize": "20k"
//     }];
//     res.json(mockup);
// });

module.exports = routers;