# Remotion workspace

This is a standalone Remotion project. It is separate from the existing Browser Lab application.

## Local commands

```bash
cd remotion
npm install
npm run studio
npm run render
```

The starter composition is named `Main` and renders 1920x1080 at 30 fps for 10 seconds.

## GitHub Actions

Use the **Render Remotion video** workflow from the Actions tab. The rendered MP4 is uploaded as a workflow artifact.

Source video files can later be placed in `public/` and imported with Remotion's `staticFile()`.
