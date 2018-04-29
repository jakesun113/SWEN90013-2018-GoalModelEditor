/* Mock back-end server.
 *
 */

const DEFAULT_PORT = 3000;

const http = require("http");
const app = require("./app");
const port = process.env.PORT || DEFAULT_PORT;
const server = http,createServer(app);

server.listen(port);
