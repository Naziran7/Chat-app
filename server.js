const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("A user connected");

  // When a user logs in
  socket.on("login", (username) => {
    socket.username = username;
    onlineUsers[socket.id] = username;
    io.emit("online users", Object.values(onlineUsers));
    io.emit("chat message", `${username} joined the chat`);
  });

  // Handle chat messages
  socket.on("chat message", (msg) => {
    io.emit("chat message", `${socket.username}: ${msg}`);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    if (socket.username) {
      io.emit("chat message", `${socket.username} left the chat`);
      delete onlineUsers[socket.id];
      io.emit("online users", Object.values(onlineUsers));
    }
    console.log("A user disconnected");
  });
});

http.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
