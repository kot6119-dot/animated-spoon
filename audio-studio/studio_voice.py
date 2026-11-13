#!/usr/bin/env python3
"""Create a dry, full-bodied studio WAV copy of the approved IMPERIAL LUXE narrator."""
from pathlib import Path
import json
import subprocess

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "remotion" / "public" / "videos" / "sexy_official_cocky.mp3"
OUT = ROOT / "AUDIO_OUTPUT" / "studio"
WAV = OUT / "sexy_official_cocky-studio.wav"

def run(args, capture=False):
    print("+", " ".join(map(str, args)), flush=True)
    return subprocess.run(args, check=True, text=True, capture_output=capture)

def duration_seconds(path):
    result = run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                  "-of", "json", str(path)], capture=True)
    return float(json.loads(result.stdout)["format"]["duration"])

# Same dry, warm studio direction as the approved second-voice WOW version.
# No echo/reverb, pitch or speed change. The original approved recording is untouched.
FILTERS = (
    "highpass=f=55,"
    "equalizer=f=145:t=q:w=0.85:g=1.8,"
    "equalizer=f=280:t=q:w=1.0:g=-0.4,"
    "equalizer=f=2200:t=q:w=1.0:g=0.8,"
    "equalizer=f=6500:t=q:w=0.8:g=0.5,"
    "acompressor=threshold=0.105:ratio=2.4:attack=18:release=180:makeup=1.55,"
    "volume=1.12,"
    "alimiter=limit=0.92"
)

def main():
    if not SOURCE.is_file():
        raise SystemExit(f"Approved source voice not found: {SOURCE}")
    OUT.mkdir(parents=True, exist_ok=True)
    original_duration = duration_seconds(SOURCE)
    filters = FILTERS + f",atrim=duration={original_duration:.6f},asetpts=PTS-STARTPTS"
    run(["ffmpeg", "-y", "-i", str(SOURCE), "-af", filters, "-ar", "48000",
         "-c:a", "pcm_s24le", str(WAV)])
    output_duration = duration_seconds(WAV)
    if abs(original_duration - output_duration) > 0.02:
        raise SystemExit(f"Duration mismatch: source={original_duration:.3f}s output={output_duration:.3f}s")
    run(["ffprobe", "-v", "error", "-show_entries",
         "stream=codec_name,sample_rate,channels,bits_per_sample",
         "-of", "default=noprint_wrappers=1", str(WAV)])
    run(["ffmpeg", "-v", "error", "-i", str(WAV), "-f", "null", "-"])
    print(f"SUCCESS: dry studio WAV decoded; duration preserved at {output_duration:.3f}s; source untouched.")

if __name__ == "__main__":
    main()
