function getValue() {
    const https = require('https');
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    const options = {
        hostname: 'localhost',
        port: 3001,
        path: '/',
        method: 'GET'
    };

    const req = https.request(options, (res) => {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);
        res.on('data', (d) => {
            console.log(d);
        });
    });

    req.on('error', (e) => {
        console.error(e);
    });
    req.end();
}
module.exports.getValue = getValue;

