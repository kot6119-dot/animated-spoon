#!/usr/bin/env python3
"""Audio utilities for the Remotion workspace. All edits write a new output file."""
from __future__ import annotations
import argparse
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AUDIO_DIRS = [ROOT / "public" / "audio", ROOT / "public" / "videos"]
FORMATS = {".wav", ".mp3", ".m4a", ".aac", ".flac", ".ogg", ".aiff", ".aif"}

def run(args):
    subprocess.run(["ffmpeg", "-hide_banner", "-y", *map(str, args)], check=True)

def catalog(_):
    found = 0
    for folder in AUDIO_DIRS:
        if folder.exists():
            for p in sorted(folder.rglob("*")):
                if p.is_file() and p.suffix.lower() in FORMATS:
                    print(p.relative_to(ROOT))
                    found += 1
    print(f"Audio files found: {found}")

def info(a):
    subprocess.run(["ffprobe", "-v", "error", "-show_entries",
                    "format=duration,format_name:stream=codec_name,sample_rate,channels",
                    "-of", "default=noprint_wrappers=1", str(a.input)], check=True)

def output_parent(path):
    Path(path).parent.mkdir(parents=True, exist_ok=True)

def trim(a):
    output_parent(a.output)
    run(["-ss", a.start, "-i", a.input, "-t", a.duration, "-c:a", "libmp3lame", "-q:a", "2", a.output])

def volume(a):
    output_parent(a.output)
    run(["-i", a.input, "-af", f"volume={a.level}dB", "-c:a", "libmp3lame", "-q:a", "2", a.output])

def fade(a):
    output_parent(a.output)
    filters = []
    if a.fade_in > 0:
        filters.append(f"afade=t=in:st=0:d={a.fade_in}")
    if a.fade_out > 0:
        filters.append(f"afade=t=out:st={a.fade_out_start}:d={a.fade_out}")
    run(["-i", a.input, "-af", ",".join(filters), "-c:a", "libmp3lame", "-q:a", "2", a.output])

def mix(a):
    output_parent(a.output)
    run(["-i", a.first, "-i", a.second, "-filter_complex",
         f"[0:a]volume={a.first_level}[a0];[1:a]volume={a.second_level}[a1];[a0][a1]amix=inputs=2:duration=longest:normalize=0[a]",
         "-map", "[a]", "-c:a", "libmp3lame", "-q:a", "2", a.output])

def convert(a):
    output_parent(a.output)
    run(["-i", a.input, a.output])

def main():
    p = argparse.ArgumentParser(description="Remotion audio tools (non-destructive)")
    sub = p.add_subparsers(required=True)
    c = sub.add_parser("catalog", help="List audio files in the Remotion workspace")
    c.set_defaults(func=catalog)
    i = sub.add_parser("info", help="Show duration, codec and audio properties")
    i.add_argument("input"); i.set_defaults(func=info)
    t = sub.add_parser("trim", help="Cut a section without changing the source")
    t.add_argument("input"); t.add_argument("output"); t.add_argument("--start", required=True)
    t.add_argument("--duration", required=True); t.set_defaults(func=trim)
    v = sub.add_parser("volume", help="Change level in dB")
    v.add_argument("input"); v.add_argument("output"); v.add_argument("--level", type=float, required=True)
    v.set_defaults(func=volume)
    f = sub.add_parser("fade", help="Apply fade-in and/or fade-out")
    f.add_argument("input"); f.add_argument("output"); f.add_argument("--fade-in", type=float, default=0)
    f.add_argument("--fade-out-start", type=float, default=0); f.add_argument("--fade-out", type=float, default=0)
    f.set_defaults(func=fade)
    m = sub.add_parser("mix", help="Mix two tracks with independent levels")
    m.add_argument("first"); m.add_argument("second"); m.add_argument("output")
    m.add_argument("--first-level", type=float, default=1); m.add_argument("--second-level", type=float, default=1)
    m.set_defaults(func=mix)
    cv = sub.add_parser("convert", help="Convert audio format")
    cv.add_argument("input"); cv.add_argument("output"); cv.set_defaults(func=convert)
    a = p.parse_args()
    a.func(a)

if __name__ == "__main__":
    main()
