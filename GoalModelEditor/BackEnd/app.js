var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var db = require('./dbConn.js');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
var projectRouter = require('./routes/project');

// const
let config = require('./config');


var app = express();

// view engine setup
app.set('views', config.server.distFolder);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(config.server.srcFolder));

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/project', projectRouter);

app.use(bodyParser.json()); // for parsing application/json

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
