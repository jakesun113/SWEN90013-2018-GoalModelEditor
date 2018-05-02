var express = require('express');
var router = express.Router();

/* GET edit page. */
router.get('/', function(req, res, next) {
    res.render("./user/project/projectedit");
});

module.exports = router;