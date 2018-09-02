/* Express App
 *
 * Runs REST API for back-end REST API: responsible for catching and
 * routing incoming HTTP(S) requests from the front-end to their endpoints.
 *
 */

// express application and middleware modules
const express = require("express");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

// helper modules from stdlib
const logger = require("morgan");

// routes to endpoints
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/user");
const projectRouter = require("./routes/project");
const goalModelRouter = require("./routes/goal_model");

// server config
let config = require("./config");

let app = express();

// view engine setup
app.set("views", config.FRONT_VIEW_DIR);
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

// middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(config.FRONT_SRC_DIR));
app.use(express.static(config.FRONT_MXGRAPH_DIR));

// route to endpoints
app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use("/project", projectRouter);
app.use("/goal_model", goalModelRouter);

// QUESTION: should this occur before the routing to endpoints?
app.use(bodyParser.json()); // for parsing application/json

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
