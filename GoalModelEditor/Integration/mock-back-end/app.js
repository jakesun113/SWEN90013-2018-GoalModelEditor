/* Express Application
 * - Receives HTTPS requests
 * - Routes requests to relevant resources
 * - Collates and returns HTTPS responses
 */

const express = require("express");
const router = express.Router(); // currently does nothing
const app = express();

/* Mock implementation of:
 *      (1) The routing schema;
 *      (2) Back-end responses to all possible front-end requests.
 * 
 * Assumes the following routing schema.
 *      routes
 *      |-- users
 *      |-- projects
 */


module.exports = app;
