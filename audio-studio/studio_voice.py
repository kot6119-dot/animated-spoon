#!/usr/bin/env python3
"""Create a gentle studio-polished copy of the approved IMPERIAL LUXE narrator."""
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "remotion" / "public" / "videos" / "sexy_official_cocky.mp3"
OUT = ROOT / "AUDIO_OUTPUT" / "studio"
WAV = OUT / "sexy_official_cocky-studio.wav"
MP3 = OUT / "sexy_official_cocky-studio.mp3"

# Subtle cleanup and control only. No pitch, speed, voice conversion or artificial reverb.
FILTERS = (
    "highpass=f=70,"
    "equalizer=f=240:t=q:w=1.0:g=-0.8,"
    "equalizer=f=3200:t=q:w=1.0:g=1.0,"
    "acompressor=threshold=0.125:ratio=2:attack=15:release=140:makeup=1.2,"
    "alimiter=limit=0.92"
)

def run(args):
    print("+", " ".join(map(str, args)), flush=True)
    subprocess.run(args, check=True)

def main():
    if not SOURCE.is_file():
        raise SystemExit(f"Approved source voice not found: {SOURCE}")
    OUT.mkdir(parents=True, exist_ok=True)
    run(["ffmpeg", "-y", "-i", str(SOURCE), "-af", FILTERS, "-ar", "48000",
         "-c:a", "pcm_s24le", str(WAV)])
    run(["ffmpeg", "-y", "-i", str(WAV), "-c:a", "libmp3lame",
         "-b:a", "192k", "-ar", "48000", str(MP3)])
    for path in (SOURCE, WAV, MP3):
        run(["ffprobe", "-v", "error", "-show_entries",
             "format=duration:stream=codec_name,sample_rate,channels",
             "-of", "default=noprint_wrappers=1", str(path)])
    # Decode the final MP3 completely to catch damaged output.
    run(["ffmpeg", "-v", "error", "-i", str(MP3), "-f", "null", "-"])
    print("SUCCESS: source preserved; studio WAV and MP3 rendered and decoded.")

if __name__ == "__main__":
    main()
