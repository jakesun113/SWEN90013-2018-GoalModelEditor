/* Server Configuration File
 */

const path = require('path');

module.exports = {

    // default server listening port
    LISTEN_PORT : "443",

    // certificate and key file
    KEY_FILE : path.resolve(__dirname, "./certificate/private.pem"),
    CERT_FILE : path.resolve(__dirname, "./certificate/file.crt"),

    // paths to front-end files (views and source files)
    FRONT_VIEW_DIR : path.resolve(__dirname, "../FrontEnd/view"),
    FRONT_SRC_DIR : path.resolve(__dirname, "../FrontEnd/public"),

    // the secret for encrypting the cookie?
    COOKIE_SECRET : ""
};
/*
module.exports = {
    // server configuration
    server: {
        listenPort: "8080",    // The port on which the server is to listen (means that the app is at http://localhost:3000 for instance)
        distFolder: path.resolve(__dirname, '../frontEnd/view'),  // The folder that contains the views
        srcFolder: path.resolve(__dirname, '../frontEnd/public'), // The folder that contains the srcs
        cookieSecret: ''                         // The secret for encrypting the cookie
    },

    cert: {
        privateKey: path.resolve(__dirname + '/certificate/private.pem'),
        certificate: path.resolve(__dirname + '/certificate/file.crt')
    }
};
*/
