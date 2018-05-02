var express = require('express');
var routers = express.Router();

routers.use('/login', require('./login'));
routers.use('/register', require('./register'));
routers.use('/user', require('./user/users'));

/* GET home page */
routers.get('/', function(req, res, next) {
    res.render('index');
});

/* TODO for testing, to be deleted */
routers.post('/user/login', function(req, res, next){
    var id = {"id": "dsada"};
    res.json(id);
    res.redirect('/');
});

// get the project page //
/* TODO : this needs to stay */
routers.get('/project', function(req, res, next){
    if(!req.cookies.UID) {
        res.redirect('/');
    } else {
        res.render('./user/project/filesystem');
    }
});

module.exports = routers;
