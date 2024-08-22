const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const path = require("path");

const app = express();
const httpserver = http.Server(app);
const io = socketio(httpserver);

const gamedirectory = path.join(__dirname, "html");

app.use(express.static(gamedirectory));

httpserver.listen(3000);

var rooms = [];
var usernames = [];
var online = [];
var pfps = [];

io.on('connection', function(socket) {
  socket.on("join", function(room, username, pfp) {
    if(online.includes(username) && (usernames[socket.id] != username || typeof(usernames[socket.id]) === "undefined" || usernames[socket.id] === null)){
      socket.emit("dialog", "Username already taken.");
    } 
    else if(usernames[socket.id] === username && rooms[socket.id] === room){
      socket.emit("dialog", "You are already connected.");
    }
    else {
      socket.leaveAll();
      socket.join(room);
      socket.emit("join", room);
      if(typeof(usernames[socket.id]) === "undefined" || usernames[socket.id] === null){
        online.push(username);
        io.in(room).emit("recieve", "connect", username + " has entered the chat.", "Server", "favicon.png");
      }
      else if(username != usernames[socket.id]) {
        online.splice(online.indexOf(usernames[socket.id]), 1);
        online.push(username);
        socket.broadcast.to(rooms[socket.id]).emit("recieve", "r", usernames[socket.id] + " has changed ther username to " + username, "Server", "favicon.png");
        socket.emit("recieve", "s", usernames[socket.id] + " has changed ther username to " + username, "Server", "favicon.png");
      }
      if(room != rooms[socket.id] && (typeof(rooms[socket.id]) != 'undefined' || rooms[socket.id] != null)){
         io.in(rooms[socket.id]).emit("recieve", "disconnect", usernames[socket.id] + " has moved to " + room, "Server", "favicon.png");
        io.in(room).emit("recieve", "connect", username + " has entered the chat.", "Server", "favicon.png");
      }
      rooms[socket.id] = room;
      usernames[socket.id] = username;
      if(pfp === ""){pfp = "images/blank.png"}
      pfps[socket.id] = pfp;
      io.emit("usernames", online);
    }
    console.log(online);
  })

  socket.on("send", function(message) {
    io.in(rooms[socket.id]).emit("recieve", "normal", message, usernames[socket.id], pfps[socket.id]);
  })

  socket.on("disconnect", ()=>{
    if(usernames[socket.id] != null || typeof(usernames[socket.id]) != "undefined"){
      io.in(rooms[socket.id]).emit("recieve", "disconnect", usernames[socket.id] + " has left the chat.", "Server", "favicon.png");
      online.splice(online.indexOf(usernames[socket.id]), 1);
      delete rooms[socket.id];
      delete usernames[socket.id];
      delete pfps[socket.id];
      io.emit("usernames", online);
    }
    console.log(online);
  })
})
