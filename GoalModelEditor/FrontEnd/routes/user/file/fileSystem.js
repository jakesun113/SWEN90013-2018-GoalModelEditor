var express = require('express');
var routers = express.Router();

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

/* POST a new file to the server */
routers.post('/', function(req, res, next) {
    var mockup = [{
        "id":"abcdefg",
        "fileName": req.body.fileName,
        "lastModified": "2018-01-01 13:56pm",
        "owner": "me",
        "fileSize": "20k"
    }];
    res.json(mockup);
});

module.exports = routers;