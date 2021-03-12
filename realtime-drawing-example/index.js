const express = require("express")
const http = require("http")
const path = require("path")
const uuid = require("uuid")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
// require("webpack-hot-middleware/client")

dotenv.config()

const app = express()
app.use("/static", express.static(`${__dirname}/static`))
app.use(express.json())

const server = http.createServer(app)
let clients = {}
let channels = {}

app.locals.index = 100000000000

function auth(req, res, next) {
  let token
  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1]
  } else if (req.query.token) {
    token = req.query.token
  }
  if (typeof token !== "string") {
    return res.sendStatus(401)
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403)
    }
    req.user = user
    next()
  })
}

app.get("/", (req, res) => {
  app.locals.index++
  let id = app.locals.index.toString(36)
  res.redirect(`/${id}`)
})

app.get("/:roomId", (req, res) => {
  res.sendFile(path.join(__dirname, "static/index.html"))
})

function disconnected(client) {
  delete clients[client.id]
  for (let roomId in channels) {
    let channel = channels[roomId]
    if (channel[client.id]) {
      for (let peerId in channel) {
        channel[peerId].emit("remove-peer", { peer: client.user, roomId })
      }
      delete channel[client.id]
    }
    if (Object.keys(channel).length === 0) {
      delete channels[roomId]
    }
  }
}

app.get("/connect", auth, (req, res) => {
  console.log("/connect??????????")
  console.log(req.headers.accept)
  if (req.headers.accept !== "text/event-stream") {
    return res.sendStatus(404)
  }

  // write the event stream headers
  res.setHeader("Cache-Control", "no-cache")
  res.setHeader("Content-Type", "text/event-stream")
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.flushHeaders()

  // setup a client
  let client = {
    id: uuid.v4(),
    user: req.user,
    emit: (event, data) => {
      res.write(`id: ${uuid.v4()}\n`)
      res.write(`event: ${event}\n`)
      res.write(`data: ${JSON.stringify(data)}\n\n`)
    },
  }

  console.log(res)

  clients[client.id] = client

  // emit the connected state
  client.emit("connected", { user: req.user })

  req.on("close", () => {
    disconnected(client)
  })
})

app.post("/access", (req, res) => {
  if (!req.body.username) {
    return res.sendStatus(403)
  }
  const user = {
    id: uuid.v4(),
    username: req.body.username,
  }

  const token = jwt.sign(user, process.env.TOKEN_SECRET, {
    expiresIn: "3600s",
  })

  return res.json(token)
})

app.post("/:roomId/join", auth, (req, res) => {
  console.log("post :: /:roomId/join")
  let roomId = req.params.roomId
  if (channels[roomId] && channels[roomId][req.user.id]) {
    return res.sendStatus(200)
  }
  if (!channels[roomId]) {
    channels[roomId] = {}
  }

  for (let peerId in channel) {
    if (clients[peerId] && clients[req.user.id]) {
      clients[peerId].emit("add-peer", {
        peer: req.user,
        roomId,
        offer: false,
      })
      clients[req.user.id].emit("add-peer", {
        peer: clients[peerId].user,
        roomId,
        offer: true,
      })
    }
  }

  channels[roomId][req.user.id] = true
  return res.sendStatus(200)
})

app.post("/relay/:peerId/:event", auth, (req, res) => {
  console.log("post :: /relay/:peerId/:event")
  let peerId = req.params.peerId
  if (clients[peerId]) {
    clients[peerId].emit(req.params.event, { peer: req.user, data: req.body })
  }
  return res.sendStatus(200)
})

server.listen(process.env.PORT || 8081, () => {
  console.log(`Started server on port ${server.address().port}`)
})
