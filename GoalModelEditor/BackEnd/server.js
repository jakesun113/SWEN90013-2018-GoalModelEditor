/*
 * Module dependencies.
 */

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app = require("./app");
const debug = require("debug")("backend:server");
const fs = require("fs");
const https = require("https");
const config = require("./config");

const privateKey = fs.readFileSync(config.KEY_FILE, "utf8");
const certificate = fs.readFileSync(config.CERT_FILE, "utf8");
const credentials = {
    key: privateKey,
    cert: certificate,
    rejectUnauthorized: false
};

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || config.LISTEN_PORT);
app.set("port", port);

/**
 * Create HTTPs server.
 */

var server = https.createServer(credentials, app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }

    var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    debug("Listening on " + bind);
}
