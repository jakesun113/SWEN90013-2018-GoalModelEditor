var WebSocket = require("ws");
let ws = new WebSocket('ws://localhost:3001');//创建一个连接
ws.on('open', function () {
    ws.send('Hello!我是WS客户端');//发送消息给服务端
});

ws.on('message', function (message) {
    console.log("data");//监听来自服务端的消息
})