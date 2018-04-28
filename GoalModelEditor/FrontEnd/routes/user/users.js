var express = require('express');
var routers = express.Router();

routers.use('/myfile', require('./file/fileSystem'));
routers.use('/profile', require('./profile'));

/* Redirect to home page */
routers.get('/', function(req, res, next) {
    res.redirect('/');
});

/* Sign off the current user */
routers.post('/signoff', function(req, res, next) {
    // clear the cookies
    res.clearCookie('Token');
    // redirect to home page
    res.redirect('/');
});

module.exports = routers;
//try branch ignore thissß