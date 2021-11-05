const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
});
const fetch = require('cross-fetch');

io.on('connection', socket => {
  const header = socket.handshake.headers['authorization'];
  const jwt = header.split(' ')[1];

  console.log(socket.id + ' connected with socket server wohoo!');

  // To join room
  socket.on('room', function (data) {
    const MAX_SOCKET_ROOMS_SIZE = 2; // Includes socket client id and one room id

    if (socket.rooms.size < MAX_SOCKET_ROOMS_SIZE) {
      // means user is allowed to join room
      socket.join(data.room);
      socket.to(data.room).emit('new user joined');
      console.log('emitted a new user joined in ' + data.room);
    } else {
      console.log(
        'user : ' + socket.id + 'already in another room. Cannot join this room: ' + data.room
      );
    }
  });

  // When client is currently disconnecting from current service
  socket.on('disconnecting', () => {
    // get rooms current client is in
    let rooms = Array.from(socket.rooms).filter(item => item !== socket.id);

    // destroy room if noone else is present
    for (let room of rooms) {
      let numClientsInRoom = io.sockets.adapter.rooms.get(room).size;

      console.log('number of users in ' + room + ' is: ' + numClientsInRoom);
      if (numClientsInRoom === 1) {
        //send API call to destroy room
        console.log('going to destroy room now');

        const requestOptions = {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + jwt
          }
        };

        fetch('http://localhost:8081/question/room/' + room, requestOptions).then(() =>
          console.log('destroyed room:' + room)
        );
      }
    }
  });

  // When client finishes disconnecting from current service
  socket.on('disconnect', () => {
    console.log('user ' + socket.id + ' disconnected');
  });

  // When code is written in text editor by clients
  socket.on('coding event', function (data) {
    socket.to(data.room).emit('receive code', data.newCode);
  });

  // When programming language is selected by clients
  socket.on('lang event', function (data) {
    socket.to(data.room).emit('receive lang', data.newLang);
  });

  socket.on('finish', function (data) {
    socket.to(data.room).emit('finish triggered', data.room);
    socket.disconnect();
    console.log("leaving " + data.room)
  });
});

server.listen(5005, () => {
  console.log('listening on *:5005');
});
