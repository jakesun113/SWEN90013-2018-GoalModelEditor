var clientio = require("socket.io-client");
var socket;


function socket_init() {
    socket = clientio.connect("https://localhost:8080",
        {
            secure:true,
            rejectUnauthorized:false,
            reconnect:true
        });
    socket.on("connect",function () {
        console.log("back-end server is on");
        console.log("connection to server established");
    });
};


function socket_sendMessage(messagebody){
    socket.emit('chat',messagebody);
};


function socket_checkdisconnection(){
    socket.on("disconnect", function(){
        console.log("back-end server down");
    })
};


module.exports.socket_init = socket_init;
module.exports.socket_sendMessage = socket_sendMessage;
module.exports.checkdisconnection = socket_checkdisconnection;