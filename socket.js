const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const httpServer = createServer(app);
const { v4: uuidv4 } = require('uuid');

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
var PORT = 3001;

const createRoom = (recipientName) => {
  const room = uuidv4();
  io.on("connection", (socket) => {
    console.log(socket.id);
    io.emit(room, recipientName);
  });
  return room;
}



httpServer.listen(PORT, () => {
  console.log(`Socket ${PORT} portundan ayaklandı`);
});

module.exports = createRoom;