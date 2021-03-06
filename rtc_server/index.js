const express = require('express')
const http = require('http')
const dotenv = require('dotenv')
const redis = require('redis')
const bluebird = require('bluebird')
const cors = require('cors')
const socket = require('socket.io')
const axios = require('axios')
const {
  addUser,
  removeUser,
  getUsersInRoom,
  getUser,
  addUID,
  getUserId,
} = require('./src/users')
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

const lectureStatusDict = {}

io.on('connection', socket => {
  console.log('소켓 연결 완료')

  socket.on('join', message => {
    console.log('message', message)
    const user = addUser({
      socketId: socket.id,
      username: message.username,
      userId: message.userId,
      userImage: message.userImage,
      roomId: message.roomId,
      roomTitle: message.roomTitle,
      token: message.token,
      agoraId: null,
    })
    console.log('server', user)
    if (user.error) {
      socket.emit('error', user)
      return
    }

    socket.join(user.roomId)

    if (!lectureStatusDict[user.roomId]) lectureStatusDict[user.roomId] = false

    socket.emit('chat-message', {
      user: 'admin',
      text: `${user.username} 님, ${user.roomTitle} 방에 오신걸 환영합니다!`,
    })

    socket.broadcast.to(user.roomId).emit('chat-message', {
      user: 'admin',
      text: `${user.username}님이 참가했습니다!`,
    })

    //@ Send Room Users
    io.to(user.roomId).emit('update-room-users', {
      roomId: user.roomId,
      users: getUsersInRoom(user.roomId),
    })

    if (lectureStatusDict[user.roomId] === true) socket.emit('already-start')
  })

  //@ History Event
  socket.on('require-history', () => {
    // console.log('require-history')
    const user = getUser(socket.id)
    if (!user || !historyData.dict[user.roomId]) return
    for (let i = 0; i < historyData.dict[user.roomId].length; i++) {
      switch (historyData.dict[user.roomId][i].event) {
        case 'pencil':
          socket.emit('draw-pencil', historyData.dict[user.roomId][i])
          break
        case 'eraser':
          socket.emit('draw-eraser', historyData.dict[user.roomId][i])
          break
        case 'start':
          socket.emit('draw-start', historyData.dict[user.roomId][i])
          break
        case 'end':
          socket.emit('draw-end', historyData.dict[user.roomId][i])
          break
      }
    }
  })

  socket.on('volume-message', (uid, volume, roomId) => {
    // console.log(uid, volume, roomId)
    const userId = getUserId(uid)
    io.to(roomId).emit('volume-uid-userId', userId, volume)
  })

  socket.on('send-agora-id', (uid, targetUserId, roomId) => {
    // console.log('send-agora-id')
    addUID(uid, targetUserId)
    io.to(roomId).emit('update-room-users', {
      roomId: roomId,
      users: getUsersInRoom(roomId),
    })
  })

  //@ Chat Event
  socket.on('chat-send-message', message => {
    const user = getUser(socket.id)
    if (!user) return
    io.to(user.roomId).emit('chat-message', message)
  })

  //@ Draw Event
  socket.on('draw-start', message => {
    const user = getUser(socket.id)
    if (!user) return
    historyData.push(user.roomId, message)
    socket.broadcast.to(user.roomId).emit('draw-start', message)
  })

  socket.on('draw-end', message => {
    const user = getUser(socket.id)
    if (!user) return
    historyData.push(user.roomId, message)
    socket.broadcast.to(user.roomId).emit('draw-end', message)
  })

  socket.on('draw-pencil', message => {
    const user = getUser(socket.id)
    if (!user) return
    historyData.push(user.roomId, message)
    socket.broadcast.to(user.roomId).emit('draw-pencil', message)
  })

  socket.on('draw-eraser', message => {
    const user = getUser(socket.id)
    if (!user) return
    historyData.push(user.roomId, message)
    socket.broadcast.to(user.roomId).emit('draw-eraser', message)
  })

  //@ Host Move Event
  socket.on('host-move', message => {
    const user = getUser(socket.id)
    if (!user) return
    socket.broadcast.to(user.roomId).emit('host-move', message)
  })

  //@ Layer Events
  socket.on('create-layer', message => {
    // console.log('create-layer')
    const user = getUser(socket.id)
    if (!user) return
    socket.broadcast.to(user.roomId).emit('create-layer', message)
  })

  socket.on('delete-layer', message => {
    // console.log('delete-layer')
    const user = getUser(socket.id)
    if (!user) return
    socket.broadcast.to(user.roomId).emit('delete-layer', message)
  })

  //@ Modified Mode Events
  socket.on('modified-mode-start', message => {
    // console.log('modified-mode-start')
    const user = getUser(socket.id)
    if (!user) return
    // console.log('modified-mode-start')
    socket.broadcast.to(user.roomId).emit('modified-mode-start', message)
  })

  socket.on('modified-mode-end', message => {
    // console.log('modified-mode-end')
    const user = getUser(socket.id)
    if (!user) return
    // console.log('modified-mode-end')
    socket.broadcast.to(user.roomId).emit('modified-mode-end', message)
  })

  socket.on('modified-mode-copy-canvas', message => {
    // console.log('modified-mode-copy-canvas')
    const user = getUser(socket.id)
    if (!user) return
    // console.log('modified-mode-copy-canvas')
    socket.broadcast.to(user.roomId).emit('modified-mode-copy-canvas', message)
  })

  //@ Lecture Start & Close Event
  socket.on('lecture-start', () => {
    // console.log('lecture-start')
    const user = getUser(socket.id)
    if (!user) return
    lectureStatusDict[user.roomId] = true
    socket.broadcast.to(user.roomId).emit('lecture-start')
  })

  socket.on('lecture-close', () => {
    // console.log('lecture-close')
    const user = getUser(socket.id)
    if (!user) return
    socket.broadcast.to(user.roomId).emit('lecture-close')
  })

  socket.on('disconnect', () => {
    const user = removeUser(socket.id)
    // console.log(user)
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
        username: user.username,
        text: `${user.username}님이 나가셨습니다.`,
      })
      io.to(user.roomId).emit('update-room-users', {
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
