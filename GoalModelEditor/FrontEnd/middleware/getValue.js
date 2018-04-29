function getValue(sendmessage) {
    var temp = "aaa";
    var WebSocket = require('ws');
    let ws = new WebSocket('ws://localhost:3001/ws');//创建一个连接

    ws.onopen=function() {
        ws.send(sendmessage);//发送消息给服务端
    };

    ws.onmessage = function (message) {
        //返回来自服务端的消息
        temp = message.data;
        console.log(temp);
        ws.close();

    }

}
module.exports.getValue = getValue();

