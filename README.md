# ScribeTube

> Bulk YouTube Transcriber

A 1-click Pinokio launcher that downloads the audio from one or many YouTube
videos (or entire playlists) and transcribes them in bulk using
[faster-whisper](https://github.com/SYSTRAN/faster-whisper).

## What it does

- Paste any number of YouTube video **or** playlist URLs (one per line).
- Downloads the best audio with `yt-dlp` (bundled `ffmpeg`, no system install).
- Transcribes each item with a Whisper model (`tiny` → `large-v3`).
- Runs on **GPU** (NVIDIA, automatic) or **CPU**.
- Exports each transcript as **txt**, **srt**, **vtt**, or **json** and bundles
  them into a downloadable `.zip`.

## How to use

1. Click **Install** (installs dependencies; Whisper models download on first run).
2. Click **Start**, then open the Web UI.
3. Paste YouTube URLs, choose a model size, device, language, and output format.
4. Click **Transcribe**. Results appear in the table and a `.zip` download.

Transcripts are also saved under `app/transcripts/run_<timestamp>/`.

## Options

| Option        | Description                                                        |
|---------------|--------------------------------------------------------------------|
| Model size    | `tiny`, `base`, `small`, `medium`, `large-v3` (bigger = better/slower) |
| Device        | `auto` (GPU if available), `cpu`, `cuda`                            |
| Language      | Blank = auto-detect, or an ISO code such as `en`, `fr`, `es`       |
| Output format | `txt`, `srt`, `vtt`, `json`                                        |

## Programmatic access

The transcription engine is plain `faster-whisper` + `yt-dlp`, so you can script
the same pipeline directly.

### Python

```python
import yt_dlp
from faster_whisper import WhisperModel

url = "https://www.youtube.com/watch?v=VIDEO_ID"
opts = {"format": "bestaudio/best", "outtmpl": "audio.%(ext)s", "noplaylist": True}
with yt_dlp.YoutubeDL(opts) as ydl:
    info = ydl.extract_info(url, download=True)
    audio = ydl.prepare_filename(info)

model = WhisperModel("small", device="auto", compute_type="int8")
segments, info = model.transcribe(audio)
print("".join(seg.text for seg in segments))
```

### JavaScript (Node)

```javascript
import { spawnSync } from "node:child_process";

// Download audio
spawnSync("yt-dlp", ["-f", "bestaudio/best", "-o", "audio.%(ext)s",
  "https://www.youtube.com/watch?v=VIDEO_ID"], { stdio: "inherit" });

// Transcribe with the bundled CLI
spawnSync("whisper-ctranslate2", ["audio.webm", "--model", "small",
  "--output_format", "srt"], { stdio: "inherit" });
```

### Curl

`yt-dlp` and `faster-whisper` are local tools, not an HTTP API. To fetch a
single video's audio without this app:

```bash
yt-dlp -f bestaudio/best -o "audio.%(ext)s" "https://www.youtube.com/watch?v=VIDEO_ID"
```

## Requirements

- ~1–3 GB disk for Whisper models (downloaded on demand).
- NVIDIA GPU optional; CPU works for smaller models.
