const http = require("http")
const WebSocket = require("ws")
const chokidar = require("chokidar")
const { spawn } = require("child_process")

const PORT = 3001

// Create an HTTP server
const server = http.createServer()
const wss = new WebSocket.Server({ server })

let lock = false

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

    const args = filePath ? [`"${filePath}"`] : []

    buildProcess = spawn("npm run dev", args, {
      stdio: "inherit",
      shell: true
    }).on("error", e => {
      console.error(e)
    })

    wss.clients.forEach(client => {
      buildProcess.on("exit", () => {
        if (lock) {
          console.log("Build process is already running")
          return
        }

        console.log("Build complete")
        client.send("reload")

        setTimeout(() => {
          lock = false
        }, 1000)
      })
    })
  } catch (e) {
    console.error(e)
  }
}

const startChokidar = () => {
  chokidar
    .watch(["./widgets", "./packages/widget-utils/src"], {
      ignoreInitial: true,
      persistent: true
    })
    .on("change", notifyClients)

  server.listen(PORT, () => {
    console.log(`WebSocket server is running on ws://localhost:${PORT}`)
  })
}

startChokidar()
