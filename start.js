module.exports = {
  daemon: true,
  run: [
    {
      method: "notify",
      params: {
        html: "Starting Bulk YouTube Transcriber..."
      }
    },
    {
      method: "shell.run",
      params: {
        build: true,
        venv: "env",
        path: ".",
        env: {
          PYTHONUTF8: "1",
          HF_HUB_DOWNLOAD_TIMEOUT: "300"
        },
        message: [
          "python app/app.py --host 127.0.0.1 --port {{port}}"
        ],
        on: [{
          event: "/(http:\/\/\\S+)/",
          done: true
        }]
      }
    },
    {
      method: "local.set",
      params: {
        url: "{{input.event[1]}}"
      }
    },
    {
      method: "notify",
      params: {
        html: "✅ Bulk YouTube Transcriber is running!"
      }
    }
  ]
}
