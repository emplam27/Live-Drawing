var express = require('express');
var http = require('http');
var path = require('path');
var jwt = require('jsonwebtoken');
var uuid = require('uuid');
var dotenv = require('dotenv');
var redis = require('redis');
var bluebird = require('bluebird');
var cors = require('cors');
var socket = require('socket.io');
var { addUser, removeUser, getUsersInRoom, getRoom, getUser } = require('./users');

bluebird.promisifyAll(redis);
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socket(server);
app.use('/static', express.static(`${__dirname}/static`));
app.use(express.json());
app.use(cors());

io.on('connection', (socket) => {
  // console.log('소켓 연결 완료');

  socket.on('join', (message) => {
    const user = addUser({
      socketId: socket.id,
      userName: message.userName,
      userId: message.userId,
      roomId: message.roomId,
    });
    socket.join(user.roomId);
    // console.log(user);
    // console.log(message);

    socket.emit('chat-message', {
      user: 'admin',
      text: `${user.userName} 님, ${user.roomId} 방에 오신걸 환영합니다!`,
    });
    socket.broadcast.to(user.roomId).emit('chat-message', {
      user: 'admin',
      text: `${user.userName}님이 참가했습니다!`,
    });
    io.to(user.roomId).emit('roomData', {
      roomId: user.roomId,
      userIds: getUsersInRoom(user.roomId),
    });
  });

  //@ Chat Event
  socket.on('chat-send-message', (message) => {
    // console.log('sendmsg socket', socket.id);
    const user = getUser(socket.id);
    io.to(user.roomId).emit('chat-message', message);
  });

  //@ Draw Event
  socket.on('draw-pencil', (message) => {
    // console.log('draw-pencil');
    const user = getUser(socket.id);
    socket.broadcast.to(user.roomId).emit('draw-pencil', message);
  });

  socket.on('draw-eraser', (message) => {
    // console.log('draw-eraser');
    const user = getUser(socket.id);
    socket.broadcast.to(user.roomId).emit('draw-eraser', message);
  });

  socket.on('create-layer', (message) => {
    console.log('create-layer');
    const user = getUser(socket.id);
    socket.broadcast.to(user.roomId).emit('create-layer', message);
  });

  socket.on('delete-layer', (message) => {
    console.log('delete-layer');
    const user = getUser(socket.id);
    socket.broadcast.to(user.roomId).emit('delete-layer', message);
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    // console.log('유저의 연결이 끊어졌습니다.');
    if (user) {
      io.to(user.roomId).emit('chat-message', {
        userId: user.userId,
        userName: user.userName,
        text: `${user.userName}님이 나가셨습니다.`,
      });
      io.to(user.roomId).emit('roomData', {
        room: user.roomId,
        userIds: getUsersInRoom(user.roomId),
      });
    }
  });
});

server.listen(process.env.PORT || 7000, () => {
  console.log(`Started server on port ${server.address().port}`);
});
