/* Express Application
 * - Receives HTTPS requests
 * - Routes requests to relevant resources
 * - Collates and returns HTTPS responses
 */

// launch application
const express = require("express");
const router = express.Router(); // currently does nothing
const app = express();

const bodyParser = require("body-parser");

// middleware - parse all requests
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json({type : "application/json"}));

/* Routes to mock resources.
 * Assumes the following routing schema.
 *      routes
 *      |-- users
 *      |-- projects
 */
const userRoutes = require("./routes/users");
const projectRoutes = require("./routes/projects");

app.use("/users", userRoutes);
app.use("/projects", projectRoutes);

// export for user in server
module.exports = app;