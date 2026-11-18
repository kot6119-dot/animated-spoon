# Remotion Studio

Clean vertical video workspace.

- Remotion and @remotion/cli are pinned to 4.0.544.
- React and React DOM are pinned to 18.3.1.
- Starter composition: Main, 1080x1920, 30 fps.
- Source media belongs in public/ only when needed for a new project.
- Project-specific media and scenes are removed after each completed or abandoned video.
- Shared sound library, common tools, export settings, and GitHub Actions workflows must be preserved.

## Local commands

```bash
cd remotion
npm install
npm run studio
npm run render
```

The GitHub Actions workflow renders the selected composition and exports an iPhone-compatible MP4 (H.264 Main, 1080x1920, AAC).
