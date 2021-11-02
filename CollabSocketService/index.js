const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
});


// app.get('/', (req, res) => {
//   res.send('<h1>Hello world</h1>');
// });

io.on('connection', (socket) => {
    console.log(socket.id + " connected with socket server wohoo!");

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('room', function(data) {
        socket.join(data.room);
        socket.to(data.room).emit('new user joined');
        console.log("emitted a new user joined");
    });

    //leave room done automatically by socket.io

    socket.on('coding event', function(data) {
        socket.to(data.room).emit('receive code', data.newCode);
    });

    socket.on('lang event', function(data) {
        socket.to(data.room).emit('receive lang', data.newLang);
    });
});

server.listen(5005, () => {
  console.log('listening on *:5005');
});
