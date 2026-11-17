# Remotion Studio

Clean vertical video workspace.

- Remotion and @remotion/cli are pinned to 4.0.544.
- React and React DOM are pinned to 18.3.1.
- Starter composition: Main, 1080x1920, 30 fps, 10 seconds.
- Source media belongs in public/ only when needed for a new project.
- No previous Jaguar or diamond-bottle media is part of this workspace.

## Local commands

```bash
cd remotion
npm install
npm run studio
npm run render
```

The GitHub Actions workflow can render the selected composition and export an iPhone-compatible MP4 (H.264 Main, 1080x1920, AAC).
