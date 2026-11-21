# Remotion Studio

Clean workspace for creating new vertical videos.

## Project baseline

- Remotion and @remotion/cli are pinned to 4.0.544.
- React and React DOM are pinned to 18.3.1.
- Main composition: 1080x1920, 30 fps, 10-second empty starter.
- Source media folder: `public/videos/`.
- Render output: `out/` (downloaded as a GitHub Actions artifact).

## Clean-start rules

1. Start every new video from the current `src/Root.jsx`. It contains no old scene, audio, or video references.
2. Put new source media only in `public/videos/`.
3. Before connecting a source, inspect the folder and confirm its exact filename.
4. Update `src/Root.jsx` deliberately to use only the new project's media. Never guess filenames.
5. Keep the `Main` composition unless a separate composition is intentionally needed.
6. Do not copy rendered MP4 files back into `public/videos/`. Rendered files belong in `out/` and are delivered as workflow artifacts.
7. Rendering is manual only: use Actions → Render Remotion video → Run workflow. Uploading a source file does not start a render.
8. Do not delete files whose purpose or references have not been checked.

## Render settings

The workflow exports an iPhone-compatible MP4: H.264 Main, 1080x1920, 30 fps, AAC audio.

## Local commands

```bash
cd remotion
npm install
npm run studio
npm run render
```
