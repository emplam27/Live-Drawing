const express = require('express')
const http = require('http')
const path = require('path')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const redis = require('redis')
const bluebird = require('bluebird')
const cors = require('cors')
const socket = require('socket.io')
const axios = require('axios')
const { addUser, removeUser, getUsersInRoom, getUser } = require('./src/users')
const defaultDict = require('./src/default-dict')
const historyData = defaultDict()

bluebird.promisifyAll(redis)
dotenv.config()

const app = express()
const server = http.createServer(app)
const io = socket(server)
app.use('/static', express.static(`${__dirname}/static`))
app.use(express.json())
app.use(cors())

io.on('connection', socket => {
  console.log('소켓 연결 완료')

  socket.on('join', message => {
    const user = addUser({
      socketId: socket.id,
      userName: message.userName,
      userId: message.userId,
      roomId: message.roomId,
      roomTitle: message.roomTitle,
      token: message.token,
    })
    if (user.error) {
      socket.emit('error', user)
      return
    }
    socket.join(user.roomId)

    socket.emit('chat-message', {
      user: 'admin',
      text: `${user.userName} 님, ${user.roomTitle} 방에 오신걸 환영합니다!`,
    })

    socket.broadcast.to(user.roomId).emit('chat-message', {
      user: 'admin',
      text: `${user.userName}님이 참가했습니다!`,
    })

    //@ Send Room Users
    io.to(user.roomId).emit('update-room-users', {
      roomId: user.roomId,
      users: getUsersInRoom(user.roomId),
    })
  })

  //@ History Event
  socket.on('require-history', () => {
    const user = getUser(socket.id)
    if (historyData.dict[user.roomId])
      for (let i = 0; i < historyData.dict[user.roomId].length; i++) {
        switch (historyData.dict[user.roomId][i].event) {
          case 'pencil':
            socket.emit('draw-pencil', historyData.dict[user.roomId][i])
            break
          case 'eraser':
            socket.emit('draw-eraser', historyData.dict[user.roomId][i])
            break
        }
      }
  })

  //@ Chat Event
  socket.on('chat-send-message', message => {
    // console.log('sendmsg socket', socket.id);
    const user = getUser(socket.id)
    io.to(user.roomId).emit('chat-message', message)
  })

  //@ Draw Event
  socket.on('draw-pencil', message => {
    const user = getUser(socket.id)
    historyData.push(user.roomId, message)
    socket.broadcast.to(user.roomId).emit('draw-pencil', message)
  })

  socket.on('draw-eraser', message => {
    const user = getUser(socket.id)
    historyData.push(user.roomId, message)
    socket.broadcast.to(user.roomId).emit('draw-eraser', message)
  })

  socket.on('create-layer', message => {
    console.log('create-layer')
    const user = getUser(socket.id)
    socket.broadcast.to(user.roomId).emit('create-layer', message)
  })

  socket.on('delete-layer', message => {
    console.log('delete-layer')
    const user = getUser(socket.id)
    socket.broadcast.to(user.roomId).emit('delete-layer', message)
  })

  socket.on('disconnect', () => {
    const user = removeUser(socket.id)
    console.log('유저의 연결이 끊어졌습니다.')
    if (user) {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: user.token,
      }
      axios.post(
        `${process.env.REACT_APP_API_URL}/${user.roomId}/disconnect`,
        { userId: user.userId },
        { headers: headers }
      )
      io.to(user.roomId).emit('chat-message', {
        userId: user.userId,
        userName: user.userName,
        text: `${user.userName}님이 나가셨습니다.`,
      })
      io.to(user.roomId).emit('roomData', {
        roomId: user.roomId,
        users: getUsersInRoom(user.roomId),
      })
      const users = getUsersInRoom(user.roomId)
      if (users.length === 0) delete historyData.dict[user.roomId]
    }
  })
})

server.listen(process.env.PORT || 7000, () => {
  console.log(`Started server on port ${server.address().port}`)
})
