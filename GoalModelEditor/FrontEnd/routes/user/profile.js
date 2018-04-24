var express = require('express');
var router = express.Router();

/* GET user profile page */
router.get('/', function(req, res, next) {
    res.render("./user/userprofile");
});

module.exports = router;
