const http = require("http")
const WebSocket = require("ws")
const chokidar = require("chokidar")
const { spawn } = require("child_process")

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

let buildProcess = null

// Watch files for changes
const notifyClients = async filePath => {
  try {
    if (buildProcess) {
      console.log("Killing previous build process")
      buildProcess.kill()
    }

    console.log(`${filePath} changed, waiting for build to complete`)
    buildProcess = spawn("npm", ["run", "dev"], {
      shell: true,
      stdio: "inherit"
    })

    wss.clients.forEach(client => {
      buildProcess.on("exit", () => {
        console.log("Build complete")
        client.send("reload")
      })
    })
  } catch (e) {
    console.error(e)
  }
}

chokidar
  .watch(["./widgets", "./packages/widget-utils/src"], {
    ignoreInitial: true,
    persistent: true
  })
  .on("change", notifyClients)

server.listen(PORT, () => {
  console.log(`WebSocket server is running on ws://localhost:${PORT}`)
})
