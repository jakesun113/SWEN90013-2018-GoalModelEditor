var express = require('express');
var router = express.Router();

/* GET user profile page */
router.get('/', function(req, res, next) {
    res.render("./user/userprofile");
});

router.get('/profile', function(req, res, next) {
    var mockup = [{
        "Username": "jakesun",
        "FirstName": "Jake",
        "LastName": "Sun",
        "Email": "jakesun@gmail.com"
    }];
    res.json(mockup);
});

/* POST a new file to the server */
router.post('/', function(req, res, next) {
    var mockup = [{
        "FirstName": "Just",
        "LastName": "Test",
        "Email": "test@gmail.com"
    }];
    res.json(mockup);
});
module.exports = router;
