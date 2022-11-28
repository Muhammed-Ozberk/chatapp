var app = require('../app');
const http = require('http').Server(app);
const config = require('../config/config');
var jwt = require('jsonwebtoken');

const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ["GET"]
    }
});

module.exports = {
    _socket: null,

    attach: function (server) {

        if (this._socket == null) {
            this._socket = io.attach(server);
            io.use((socket,next) => {
                if (socket.handshake.query && socket.handshake.query.token){
                    jwt.verify(socket.handshake.query.token,config.jwt.secretKey, function(err, decoded) {
                      if (err) return next(new Error('Authentication error'));
                      socket.decoded = decoded;
                      next();
                    });
                  }
                  else {
                    next(new Error('Authentication error'));
                  }    
            }).on("connection", (socket) => {
                console.log("A user connected");

                socket.on("sendMessage", (message, roomID) => {
                    socket.broadcast.emit(roomID, message);//Distributing the incoming message to everyone except the sender
                });

                socket.on("connect_error", (err) => { console.log(`connect_error due to ${err.message}`); });
                socket.on("disconnect", (reason) => {
                    console.log("user logged out");
                });
            });
        }
    },

}

