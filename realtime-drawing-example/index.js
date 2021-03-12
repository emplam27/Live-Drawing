var express = require("express")
var http = require("http")
var ws = require("ws")
var uuid = require("uuid")

const app = express()
app.use(express.static(`${__dirname}/static`))
app.locals.connections = []

const server = http.createServer(app)
const wss = new ws.Server({ server })

function broadcastConnections() {
  let ids = app.locals.connections.map((c) => c._connId)
  app.locals.connections.forEach((c) => {
    c.send(JSON.stringify({ type: "ids", ids }))
  })
}

wss.on("connection", (ws) => {
  app.locals.connections.push(ws)
  ws._connId = `conn-${uuid.v4()}`

  // send the local id for the connection
  ws.send(JSON.stringify({ type: "connection", id: ws._connId }))

  // send the list of connection ids
  broadcastConnections()

  ws.on("close", () => {
    let index = app.locals.connections.indexOf(ws)
    app.locals.connections.splice(index, 1)

    // send the list of connection ids
    broadcastConnections()
  })

  ws.on("message", (message) => {
    for (let i = 0; i < app.locals.connections.length; i++) {
      if (app.locals.connections[i] !== ws) {
        app.locals.connections[i].send(message)
      }
    }
  })
})

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "static/index.html"))
})

server.listen(process.env.PORT || 8081, () => {
  console.log(`Started server on port ${server.address().port}`)
})
