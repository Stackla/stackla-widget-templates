const http = require("http")
const WebSocket = require("ws")
const chokidar = require("chokidar")

const PORT = 3001
const DEBOUNCE_DELAY = 300

// Create an HTTP server
const server = http.createServer()
const wss = new WebSocket.Server({ server })

wss.on("connection", ws => {
  console.log("Client connected")

  ws.on("close", () => {
    console.log("Client disconnected")
  })
})

// Debounce function
function debounce(func, delay) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), delay)
  }
}

// Watch files for changes
const notifyClients = debounce(filePath => {
  console.log(`${filePath} changed, notifying clients...`)
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      const { spawn } = require("child_process")
      const build = spawn("npm", ["run", "dev"], {
        stdio: "inherit",
        shell: true
      })

      build.on("exit", () => {
        client.send("reload")
      })
    }
  })
}, DEBOUNCE_DELAY)

chokidar
  .watch(["./widgets", "./packages/widget-utils/src"], {
    ignoreInitial: true,
    persistent: true
  })
  .on("change", notifyClients)

server.listen(PORT, () => {
  console.log(`WebSocket server is running on ws://localhost:${PORT}`)
})
