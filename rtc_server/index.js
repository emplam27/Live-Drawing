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

io.on('connection', (socket) => {
  console.log('소켓 연결 완료');

  socket.on('join', (message) => {
    const user = addUser({
      id: socket.id,
      name: message.userId,
      room: message.room,
    });
    // if (error) return callback(error)

    socket.join(user.room);
    socket.emit('message', {
      user: 'admin',
      text: `${user.name} 님, ${user.room} 방에 오신걸 환영합니다!`,
    });
    socket.broadcast.to(user.room).emit('message', {
      user: 'admin',
      text: `${user.name}님이 참가했습니다!`,
    });
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
  });

  socket.on('send message', (message) => {
    console.log('sendmsg socket', socket.id);
    const user = getUser(socket.id);
    io.to(user.room).emit('message', message);
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    console.log('유저의 연결이 끊어졌습니다.');
    if (user) {
      io.to(user.room).emit('message', {
        userId: user.name,
        text: `${user.name}님이 나가셨습니다.`,
      });
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

app.use('/static', express.static(`${__dirname}/static`));
app.use(express.json());
app.use(cors());

app.locals.index = 100000000000;

// const server = http.createServer(app)
// const socket = require('socket.io')
// const io = socket(server)

// const users = {}

// const socketToRoom = {}

// io.on('connection', socket => {
//   socket.on('join room', roomID => {
//     if (users[roomID]) {
//       const length = users[roomID].length
//       if (length === 4) {
//         socket.emit('room full')
//         return
//       }
//       users[roomID].push(socket.id)
//     } else {
//       users[roomID] = [socket.id]
//     }
//     socketToRoom[socket.id] = roomID
//     const usersInThisRoom = users[roomID].filter(id => id !== socket.id)

//     socket.emit('all users', usersInThisRoom)
//   })

//   socket.on('sending signal', payload => {
//     io.to(payload.userToSignal).emit('user joined', {
//       signal: payload.signal,
//       callerID: payload.callerID,
//     })
//   })

//   socket.on('returning signal', payload => {
//     io.to(payload.callerID).emit('receiving returned signal', {
//       signal: payload.signal,
//       id: socket.id,
//     })
//   })

//   socket.on('disconnect', () => {
//     const roomID = socketToRoom[socket.id]
//     let room = users[roomID]
//     if (room) {
//       room = room.filter(id => id !== socket.id)
//       users[roomID] = room
//     }
//   })
// })

const clients = {};

const redisClient = redis.createClient();

async function disconnected(client) {
  console.log('========== index.js :: disconnected ==========');

  // 나갈 peer가 호스트라면, 모든 피어들의 연결을 끊기
  let roomIds = await redisClient.smembersAsync(`${client.id}:channels`);
  // console.log('disconnected :: roomId', roomIds);

  roomIds.forEach(async (roomId) => {
    let roomHostId = await redisClient.getAsync(`channels:${roomId}:host`);
    // console.log(client.id);
    // console.log(roomHostId);
    if (client.id === roomHostId) {
      console.log('Host is Disconneting!!1!!!!!!!!!!!!!!!!!!!!');
      await closeRoom(roomId);
      // await setNewHost(roomId, roomHostId);
    }
  });

  delete clients[client.id];
  await redisClient.delAsync(`messages:${client.id}`);

  await redisClient.delAsync(`${client.id}:channels`);
  await Promise.all(
    roomIds.map(async (roomId) => {
      await redisClient.sremAsync(`channels:${roomId}`, client.id);
      let peerIds = await redisClient.smembersAsync(`channels:${roomId}`);
      // console.log('disconnected :: peerIds', peerIds);
      let msg = JSON.stringify({
        event: 'remove-peer',
        data: {
          peer: client.user,
          roomId: roomId,
        },
      });
      await Promise.all(
        peerIds.map(async (peerId) => {
          if (peerId !== client.id) {
            await redisClient.publish(`messages:${peerId}`, msg);
          }
        })
      );
    })
  );
}

async function closeRoom(roomId) {
  // let peerIds = await redisClient.smembersAsync(`channels:${roomId}`);
  // if (peerIds.length <= 1) {
  //   console.log('no more peer in here');
  //   await redisClient.delAsync(`channels:${roomId}:host`);
  //   return;
  // }
}

async function setNewHost(roomId, hostId) {
  let peerIds = await redisClient.smembersAsync(`channels:${roomId}`);
  console.log('========== index.js :: setNewHost ==========');
  console.log("peerIds ::'", peerIds, "', roomId ::'", roomId, "', hostId ::'", hostId, "'");

  if (peerIds.length <= 1) {
    console.log('no more peer in here');
    await redisClient.delAsync(`channels:${roomId}:host`);
    return;
  }

  console.log('another peer in here');
  for (peerId in peerIds) {
    if (peerId === hostId) continue;
    await setHost(roomId, peerId);
    break;
  }
}

async function setHost(roomId, peerId) {
  console.log('========== setHost 요청을 보냄` ==========');
  console.log('roomId ::"', roomId, '", peerId ::"', peerId, '"');

  await redisClient.publish(
    `messages:${peerId}`,
    JSON.stringify({
      event: 'set-host',
      data: null,
    })
  );
  await redisClient.setAsync(`channels:${roomId}:host`, peerId);
}

function auth(req, res, next) {
  // console.log('========== index.js :: auth ==========');
  let token;
  if (req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query.token) {
    token = req.query.token;
  }
  if (typeof token !== 'string') {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

app.get('/', (req, res) => {
  // console.log('========== index.js :: GET :: / ==========');
  let id = (app.locals.index++).toString(36);
  res.redirect(`/${id}`);
});

app.post('/access', (req, res) => {
  // console.log('========== index.js :: POST :: /access ==========');
  if (!req.body.username) {
    return res.sendStatus(403);
  }

  const user = {
    id: uuid.v4(),
    username: req.body.username,
  };

  const token = jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '3600s' });
  return res.json({ token });
});

app.get('/connect', auth, (req, res) => {
  // console.log('========== index.js :: GET :: /connect ==========');

  if (req.headers.accept !== 'text/event-stream') {
    return res.sendStatus(404);
  }

  // write the event stream headers
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();

  // setup a client
  let client = {
    id: req.user.id,
    user: req.user,
    redis: redis.createClient(),
    emit: (event, data) => {
      res.write(`id: ${uuid.v4()}\n`);
      res.write(`event: ${event}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    },
  };

  // console.log('GET :: /connect  :: clients');
  // console.log(clients);

  // cache the current connection until it disconnects
  clients[client.id] = client;

  // subscribe to redis events for user
  client.redis.on('message', (channel, message) => {
    let msg = JSON.parse(message);
    client.emit(msg.event, msg.data);
  });
  client.redis.subscribe(`messages:${client.id}`);

  // emit the connected state
  client.emit('connected', { user: req.user });

  // ping to the client every so often
  setInterval(() => {
    client.emit('ping');
  }, 10000);

  req.on('close', () => {
    disconnected(client);
  });
});

app.post('/:roomId/join', auth, async (req, res) => {
  // console.log('========== index.js :: POST :: /:roomId/join ==========');

  let roomId = req.params.roomId;

  // console.log('req.user.id ::', req.user.id);
  await redisClient.saddAsync(`${req.user.id}:channels`, roomId);

  let peerIds = await redisClient.smembersAsync(`channels:${roomId}`);
  // console.log('roomId ::', roomId);
  // console.log('peerIds ::', peerIds);

  // 호스트를 만드는 이벤트
  if (peerIds.length == 0) {
    await setHost(roomId, req.user.id);
    // console.log('========== Host Id ::', req.user.id, '==========');
    // console.log(req.user.id);
    // console.log(typeof req.user.id);
    // console.log(roomId);
    // console.log(typeof roomId);
    // host 아이디 저장
    // console.log('111111111111111111111111111111111111111111');
    // await redisClient.setAsync(`channels:${roomId}:host`, req.user.id);
    // console.log(typeof req.user.id);
    // console.log('111111111111111111111111111111111111111111');
    await redisClient.saddAsync(`channels:${roomId}`, req.user.id);
    // console.log('111111111111111111111111111111111111111111');
    return res.sendStatus(200);
  }

  let hostId = await redisClient.getAsync(`channels:${roomId}:host`);
  if (!peerIds.includes(hostId)) {
    setHost(roomId, peerIds[0]);
  }

  // console.log(typeof req.user.id);
  // console.log(typeof req.user.id);
  // console.log('========== 가져온 Host Id ::', hostId, '==========');
  peerIds.forEach((peerId) => {
    // console.log('publish :: addpeer');
    redisClient.publish(
      `messages:${peerId}`,
      JSON.stringify({
        event: 'add-peer',
        data: {
          peer: req.user,
          roomId,
          offer: false,
          hostId: hostId,
        },
      })
    );
    redisClient.publish(
      `messages:${req.user.id}`,
      JSON.stringify({
        event: 'add-peer',
        data: {
          peer: { id: peerId },
          roomId,
          offer: true,
          hostId: hostId,
        },
      })
    );
  });

  await redisClient.saddAsync(`channels:${roomId}`, req.user.id);
  return res.sendStatus(200);
});

app.post('/relay/:peerId/:event', auth, (req, res) => {
  // console.log('========== index.js :: POST :: /relay/:peerId/:event ==========');
  // console.log('event :: "', req.params.event, '", peerId ::"', req.params.peerId, '"');

  let peerId = req.params.peerId;
  let msg = {
    event: req.params.event,
    data: {
      peer: req.user,
      data: req.body,
    },
  };
  redisClient.publish(`messages:${peerId}`, JSON.stringify(msg));
  return res.sendStatus(200);
});

server.listen(process.env.PORT || 8080, () => {
  console.log(`Started server on port ${server.address().port}`);
});
