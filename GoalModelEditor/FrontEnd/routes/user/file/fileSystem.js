var express = require('express');
var routers = express.Router();

routers.use('/edit', require('./edit'));

/* GET user file system */
routers.get('/', function(req, res, next) {
    res.render('./user/project/filesystem');
});

/* GET user's file list */
routers.get('/files/:userid', function(req, res, next) {
});

module.exports = routers;