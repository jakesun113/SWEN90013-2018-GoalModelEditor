// Object to store server-wide configuration variables
var path = require('path');

module.exports = {
   // server configuration
    server: {
        listenPort: "3000",    // The port on which the server is to listen (means that the app is at http://localhost:3000 for instance)
        distFolder: path.resolve(__dirname, 'view'),  // The folder that contains the application files
        srcFolder: path.resolve(__dirname, 'public'),
        cookieSecret: ''                         // The secret for encrypting the cookie
    },

    cert: {
        privateKey: __dirname + '/bin/certificate/private.pem',
        certificate: __dirname + '/bin/certificate/file.crt'
    }
};