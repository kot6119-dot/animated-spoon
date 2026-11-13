# IMPERIAL LUXE Audio Studio

Separate audio workspace for the existing repository. It does not change Remotion or overwrite source media.

## Automatic setup

GitHub Actions installs FFmpeg, SoX development libraries, Python 3.11 and cysox automatically. Open **Actions → Audio Studio → Run workflow** to run the audio environment check and asset catalog.

## Asset folders

- `SOUND_LIBRARY/Voice/` — narrator recordings.
- `SOUND_LIBRARY/Music/` — music beds.
- `SOUND_LIBRARY/Effects/` — sound effects.
- `SOUND_LIBRARY/Notifications/` — notification sounds.
- `SOUND_LIBRARY/Transitions/` — transition sounds.
- `IMAGE_LIBRARY/` — visual reference images, kept separate from audio processing.

Existing files under `remotion/public/videos/` are also included in the catalog, so there is no need to move or duplicate the current project assets.

## Commands

```bash
python audio-studio/audio_tool.py catalog
python audio-studio/audio_tool.py info path/to/voice.mp3
python audio-studio/audio_tool.py normalize path/to/voice.mp3
python audio-studio/audio_tool.py convert path/to/input.wav AUDIO_OUTPUT/output.mp3
```

All processed files go to `AUDIO_OUTPUT/` by default. Source files remain unchanged. The normalize command creates a WAV copy unless an output path is supplied.

## Available next steps

The cysox engine supports format conversion, normalization, EQ, bass/treble, filters, reverb, echo, chorus, pitch/tempo, fades, trimming, concatenation and batch processing. The initial integration exposes safe catalog, inspect, normalize and convert operations; more controls can be added when needed.
