var express = require('express');
var routers = express.Router();

routers.use('/login', require('./login'));
routers.use('/register', require('./register'));
routers.use('/user', require('./user/users'));

/* GET home page */
routers.get('/', function(req, res, next) {
    res.render('index');
});


module.exports = routers;
