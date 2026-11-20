# Remotion Studio

Clean vertical video workspace.

- Remotion and @remotion/cli are pinned to 4.0.544.
- React and React DOM are pinned to 18.3.1.
- Starter composition: Main, 1080x1920, 30 fps.

## Media cleanup and replacement rules

Follow these rules automatically for every new video upload. Do not ask the user again what to do with old files.

1. Before uploading, inspect `public/videos/` and identify the current source files.
2. When the user supplies a new source for the same scene or project, treat it as the replacement for the previous source.
3. Upload the new source first. Verify that it exists and that the active composition points to it.
4. Only after verification, delete obsolete project-specific source copies and unused intermediate renders from this project. Keep one current source for each active scene.
5. Never delete a file that is still referenced by `src/Root.jsx`, an active composition, or a workflow.
6. Never delete shared sound libraries, common tools, export settings, GitHub Actions workflows, or unrelated project assets.
7. Preserve the existing `Main` composition and the `main` branch unless the user explicitly asks to change them. Use a separate test branch for experiments.
8. After a video is completed or abandoned, remove only that video's project-specific source media and temporary renders, after checking references. Keep reusable shared assets.
9. If a file's purpose is unclear, leave it in place and report it rather than deleting it.

## Source media

Source media belongs in `public/` only when needed for an active project. Use clear, stable filenames and update the matching source reference in the composition whenever a file is replaced.

## Local commands

```bash
cd remotion
npm install
npm run studio
npm run render
```

The GitHub Actions workflow renders the selected composition and exports an iPhone-compatible MP4 (H.264 Main, 1080x1920, AAC).
