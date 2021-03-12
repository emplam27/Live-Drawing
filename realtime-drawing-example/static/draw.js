const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")

var nodes = []
var lastPoint
var currentForce = 1

function randomColor() {
  let r = Math.random() * 255
  let g = Math.random() * 255
  let b = Math.random() * 255
  return `rgb(${r}, ${g}, ${b})`
}

var color = randomColor()

function onPeerData(id, data) {
  draw(JSON.parse(data))
}

function resize() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

function draw(data) {
  context.beginPath()
  context.moveTo(data.lastPoint.x, data.lastPoint.y)
  context.lineTo(data.x, data.y)
  context.strokeStyle = data.color
  context.lineWidth = Math.pow(data.force || 1, 4) * 2
  context.lineCap = "round"
  context.stroke()
}

function force(e) {
  currentForce = e.webkitForce || 1
}

function move(e) {
  if (e.buttons) {
    if (!lastPoint) {
      lastPoint = { x: e.offsetX, y: e.offsetY }
      return
    }
    draw({
      lastPoint,
      x: e.offsetX,
      y: e.offsetY,
      force: force,
      color: color || "green",
    })

    broadcast(
      JSON.stringify({
        lastPoint,
        x: e.offsetX,
        y: e.offsetY,
        color: color || "green",
        force: force,
      })
    )

    lastPoint = { x: e.offsetX, y: e.offsetY }
  }
}

function key(e) {
  if (e.key === "Backspace") {
    context.clearRect(0, 0, canvas.width, canvas.height)
  }
}

window.onresize = resize
window.onmousemove = move
window.onkeydown = key
window.onwebkitmouseforcechanged = force

resize()
