/* Express Application
 *
 * Handles REST API for the front-end.
 *
 */

const bodyParser = require("body-parser");
const express = require("express");
const router = express.Router();
const app = express();

// routing constants
const ROUTE_PREFIX = "./routes";
const USER_ROUTE_SUFFIX = "/users";
const PROJECT_ROUTE_SUFFIX = "/projects";

// import routing modules
const user_routes = require(ROUTE_PREFIX + USER_ROUTE_SUFFIX);
const project_routes = require(ROUTE_PREFIX + PROJECT_ROUTE_SUFFIX);

// middleware - parse incoming JSON and URL-encoded data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: "application.json" }));

// middleware - routing
app.use(USER_ROUTE_SUFFIX, user_routes);
app.use(PROJECT_ROUTE_SUFFIX, project_routes);

// export for use in server
module.exports = app;
