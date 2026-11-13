#!/usr/bin/env python3
"""Create a warmer, subtly echoed WOW copy of the second IMPERIAL LUXE narrator."""
from pathlib import Path
import json
import subprocess

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "remotion" / "public" / "videos" / "sexy_official_2.mp3"
OUT = ROOT / "AUDIO_OUTPUT" / "wow"
WAV = OUT / "sexy_official_2-WOW.wav"

def run(args, capture=False):
    print("+", " ".join(map(str, args)), flush=True)
    return subprocess.run(args, check=True, text=True, capture_output=capture)

def duration_seconds(path):
    result = run([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "json", str(path)
    ], capture=True)
    return float(json.loads(result.stdout)["format"]["duration"])

# Warmer low-mid body, a touch of presence, gentle compression, then a very
# quiet 65 ms slap echo (about 10% wet). No speed or pitch change.
FILTERS = (
    "highpass=f=60,"
    "equalizer=f=155:t=q:w=0.8:g=1.7,"
    "equalizer=f=300:t=q:w=1.0:g=-0.5,"
    "equalizer=f=3200:t=q:w=1.0:g=1.1,"
    "acompressor=threshold=0.11:ratio=2.3:attack=18:release=170:makeup=1.4,"
    "aecho=0.90:0.10:65:0.10,"
    "alimiter=limit=0.92"
)

def main():
    if not SOURCE.is_file():
        raise SystemExit(f"Second narrator source not found: {SOURCE}")
    OUT.mkdir(parents=True, exist_ok=True)
    original_duration = duration_seconds(SOURCE)
    filters = FILTERS + f",atrim=duration={original_duration:.6f},asetpts=PTS-STARTPTS"
    run(["ffmpeg", "-y", "-i", str(SOURCE), "-af", filters, "-ar", "48000",
         "-c:a", "pcm_s24le", str(WAV)])
    source_duration = duration_seconds(SOURCE)
    output_duration = duration_seconds(WAV)
    if abs(source_duration - output_duration) > 0.02:
        raise SystemExit(
            f"Duration mismatch: source={source_duration:.3f}s output={output_duration:.3f}s"
        )
    run(["ffprobe", "-v", "error", "-show_entries",
         "stream=codec_name,sample_rate,channels,bits_per_sample",
         "-of", "default=noprint_wrappers=1", str(WAV)])
    run(["ffmpeg", "-v", "error", "-i", str(WAV), "-f", "null", "-"])
    print(f"SUCCESS: warm WOW WAV decoded; duration preserved at {output_duration:.3f}s; source untouched.")

if __name__ == "__main__":
    main()
