const wsConnection = new WebSocket("ws:127.0.0.1:8081", "json")

var localId, peerIds
var peerConnections = {}
var initiator = false

wsConnection.onopen = (e) => {
  console.log(`wsConnection open to 127.0.0.1:8081`, e)
}
wsConnection.onerror = (e) => {
  console.error(`wsConnection error `, e)
}
wsConnection.onmessage = (e) => {
  // console.log(JSON.parse(e.data))
  let data = JSON.parse(e.data)
  switch (data.type) {
    case "connection":
      console.log("connection")
      localId = data.id
      break
    case "ids":
      console.log("ids")
      peerIds = data.ids
      connect()
      break
    case "signal":
      signal(data.id, data.data)
      break
  }
}

function broadcast(data) {
  Object.values(peerConnections).forEach((peer) => {
    peer.send(data)
  })
}

function connect() {
  // cleanup peer connections not in peer ids
  Object.keys(peerConnections).forEach((id) => {
    if (!peerIds.includes(id)) {
      peerConnections[id].destroy()
      delete peerConnections[id]
    }
  })
  if (peerIds.length === 1) {
    initiator = true
  }
  peerIds.forEach((id) => {
    if (id === localId || peerConnections[id]) {
      return
    }

    let peer = new SimplePeer({
      initiator: initiator,
    })
    peer.on("error", console.error)
    peer.on("signal", (data) => {
      wsConnection.send(
        JSON.stringify({
          type: "signal",
          id: localId,
          data,
        })
      )
    })
    peer.on("data", (data) => onPeerData(id, data))
    peerConnections[id] = peer
  })
}

function signal(id, data) {
  if (peerConnections[id]) {
    console.log("signal")

    peerConnections[id].signal(data)
  }
}
