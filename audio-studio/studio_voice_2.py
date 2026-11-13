#!/usr/bin/env python3
"""Create a separate WOW studio version of the second IMPERIAL LUXE narrator."""
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "remotion" / "public" / "videos" / "sexy_official_2.mp3"
OUT = ROOT / "AUDIO_OUTPUT" / "wow"
WAV = OUT / "sexy_official_2-WOW.wav"

# A restrained cinematic treatment at the original duration and speed, with fuller low end,
# a little presence, controlled dynamics. No reverb, chorus, or voice conversion.
FILTERS = (
    "highpass=f=65,"
    "equalizer=f=125:t=q:w=0.8:g=1.2,"
    "equalizer=f=280:t=q:w=1.0:g=-0.8,"
    "equalizer=f=3100:t=q:w=1.0:g=0.9,"
    "acompressor=threshold=0.115:ratio=2.2:attack=18:release=160:makeup=1.35,"
    "alimiter=limit=0.92"
)

def run(args):
    print("+", " ".join(map(str, args)), flush=True)
    subprocess.run(args, check=True)

def main():
    if not SOURCE.is_file():
        raise SystemExit(f"Second narrator source not found: {SOURCE}")
    OUT.mkdir(parents=True, exist_ok=True)
    run(["ffmpeg", "-y", "-i", str(SOURCE), "-af", FILTERS, "-ar", "48000",
         "-c:a", "pcm_s24le", str(WAV)])
    run(["ffprobe", "-v", "error", "-show_entries",
         "format=duration:stream=codec_name,sample_rate,channels",
         "-of", "default=noprint_wrappers=1", str(SOURCE)])
    run(["ffprobe", "-v", "error", "-show_entries",
         "format=duration:stream=codec_name,sample_rate,channels",
         "-of", "default=noprint_wrappers=1", str(WAV)])
    run(["ffmpeg", "-v", "error", "-i", str(WAV), "-f", "null", "-"])
    print("SUCCESS: second narrator WOW WAV rendered and fully decoded; source preserved.")

if __name__ == "__main__":
    main()
