var createError = require('https-error');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var routers = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.resolve(__dirname, 'view'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, 'public')));

var expressWs = require('express-ws')(app);
var util = require('util');
app.use(express.static('./static'));
app.ws('/ws', function(ws, req) {
    util.inspect(ws);
    ws.on('message', function(msg) {
        console.log('_message');
        console.log(msg);
        ws.send('echo:' + msg);
    });
})


app.use('/', routers);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
