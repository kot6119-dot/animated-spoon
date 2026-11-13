#!/usr/bin/env python3
"""Small command-line workspace for safe, non-destructive audio processing."""
from __future__ import annotations

import argparse
from pathlib import Path
import sys

import cysox
from cysox import fx

ROOT = Path(__file__).resolve().parents[1]
SOUND_LIBRARY = ROOT / "SOUND_LIBRARY"
OUTPUT = ROOT / "AUDIO_OUTPUT"
SUPPORTED = {".wav", ".mp3", ".flac", ".ogg", ".aiff", ".aif", ".m4a"}


def catalog() -> int:
    print("IMPERIAL LUXE audio catalog")
    count = 0
    for folder in (SOUND_LIBRARY, ROOT / "remotion" / "public" / "videos"):
        if not folder.exists():
            continue
        print(f"\n[{folder.relative_to(ROOT)}]")
        for path in sorted(folder.rglob("*")):
            if path.is_file() and path.suffix.lower() in SUPPORTED:
                try:
                    info = cysox.info(str(path))
                    print(f"{path.relative_to(ROOT)} | {info.duration:.2f}s | {info.sample_rate} Hz | {info.channels} ch")
                    count += 1
                except Exception as exc:
                    print(f"{path.relative_to(ROOT)} | metadata unavailable: {exc}")
    print(f"\nAudio files found: {count}")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="IMPERIAL LUXE audio tools")
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("catalog", help="List audio assets and their technical properties")
    info_parser = sub.add_parser("info", help="Show metadata for one audio file")
    info_parser.add_argument("input", type=Path)
    norm = sub.add_parser("normalize", help="Create a normalized copy; never overwrites the source")
    norm.add_argument("input", type=Path)
    norm.add_argument("output", type=Path, nargs="?")
    convert = sub.add_parser("convert", help="Convert an audio file to another format")
    convert.add_argument("input", type=Path)
    convert.add_argument("output", type=Path)
    args = parser.parse_args()

    if args.command == "catalog":
        return catalog()
    if not args.input.exists():
        parser.error(f"Input file not found: {args.input}")
    if args.command == "info":
        item = cysox.info(str(args.input))
        print(f"File: {args.input}\nDuration: {item.duration:.2f}s\nSample rate: {item.sample_rate} Hz\nChannels: {item.channels}\nFormat: {item.format}")
        return 0
    if args.command == "normalize":
        destination = args.output or (OUTPUT / f"{args.input.stem}-normalized.wav")
        destination.parent.mkdir(parents=True, exist_ok=True)
        cysox.convert(str(args.input), str(destination), effects=[fx.Normalize()])
        print(f"Created: {destination}")
        return 0
    if args.command == "convert":
        args.output.parent.mkdir(parents=True, exist_ok=True)
        cysox.convert(str(args.input), str(args.output))
        print(f"Created: {args.output}")
        return 0
    return 0


if __name__ == "__main__":
    sys.exit(main())
