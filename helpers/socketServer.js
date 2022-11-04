var app = require('../app');
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ["GET"]
    }
});

module.exports = {
    _socket: null,

    _clints: [],

    attach: function (server) {

        if (this._socket == null) {
            this._socket = io.attach(server);
            io.on("connection", (socket) => {
                console.log("A user connected");
                console.log(socket.id);
                const count = io.engine.clientsCount;
                console.log(count);

                socket.on("sendMessage", (message, roomID) => {
                    socket.broadcast.emit(roomID, message);
                });

                socket.on("connect_error", (err) => { console.log(`connect_error due to ${err.message}`); });
                socket.on("disconnect", (reason) => {
                    console.log("çıkış yapıldı");
                    console.log(socket.id);
                });
            });
        }
    },

}

