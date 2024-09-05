const http = require("http")
const WebSocket = require("ws")
const chokidar = require("chokidar")

const PORT = 3001

// Create an HTTP server
const server = http.createServer()
const wss = new WebSocket.Server({ server })

wss.on("connection", ws => {
  console.log("Client connected")

  ws.on("close", () => {
    console.log("Client disconnected")
  })
})

// Watch files for changes
chokidar
  .watch(["./widgets/**/**"], {
    ignoreInitial: true,
    persistent: true
  })
  .on("change", filePath => {
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
  })

server.listen(PORT, () => {
  console.log(`WebSocket server is running on ws://localhost:${PORT}`)
})
