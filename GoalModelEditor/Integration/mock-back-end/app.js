/* Express Application
 * - Receives HTTPS requests
 * - Routes requests to relevant resources
 * - Collates and returns HTTPS responses
 */

// launch application
const express = require("express");
const router = express.Router(); // currently does nothing
const app = express();

/* Routes to mock resources.
 * Assumes the following routing schema.
 *      routes
 *      |-- users
 *      |-- projects
 */
const userRoutes = require("./routes/users");
const projectRoutes = require("./routes/projects");

app.use("/users");
app.use("/projects");

// export for user in server
module.exports = app;
