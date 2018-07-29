var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login',function(req, res) {
    if(req.cookies.LOKIDIED){
        res.redirect('/dashboard');
    }
  res.render('login');
});

router.get('/register', function(req, res) {
  res.render('register');
});

router.get('/dashboard', function(req, res) {
  if(req.cookies.LOKIDIED){
    res.render('user/project/dashboard');
  }
  res.redirect('/login');
});

router.get('/profile', function(req, res) {
    if(req.cookies.LOKIDIED){
        res.render('user/userprofile');
    }
    res.redirect('/login');
});

module.exports = router;
