module.exports = {
  run: [
    {
      method: "notify",
      params: {
        html: "Installing ScribeTube..."
      }
    },
    // Install transcription + download dependencies
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: ".",
        message: [
          "uv pip install -r app/requirements.txt"
        ],
      }
    },
    // NVIDIA GPU acceleration: faster-whisper (CTranslate2) needs cuBLAS + cuDNN
    {
      when: "{{gpu === 'nvidia'}}",
      method: "shell.run",
      params: {
        venv: "env",
        path: ".",
        message: [
          "uv pip install nvidia-cublas-cu12 nvidia-cudnn-cu12"
        ],
      }
    },
    // Install PyTorch (GPU-aware, cross-platform) via torch.js
    {
      method: "script.start",
      params: {
        uri: "torch.js",
        params: {
          venv: "env",
          path: "."
        }
      }
    },
    {
      method: "notify",
      params: {
        html: "✅ Installed! Whisper models download on first run. Works on GPU or CPU."
      }
    },
    {
      method: "script.start",
      params: {
        uri: "start.js"
      }
    }
  ]
}
