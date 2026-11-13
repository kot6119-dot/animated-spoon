# VIDEO_LIBRARY

Stock video clips downloaded from Pixabay through the official Pixabay API.

- Clips are stored here as MP4 files.
- Each downloaded clip has a matching JSON metadata file with its Pixabay page, creator, and source.
- Search requests are written to `.github/VIDEO_REQUEST.txt`.
- The workflow is `.github/workflows/pixabay-video-download.yml`.

## API setup

Add a repository Actions secret named `PIXABAY_API_KEY` containing the free API key from https://pixabay.com/api/docs/.

The Pixabay API requires this key. Keep it in GitHub Actions Secrets; never commit it to the repository.

Before publishing, check the individual clip page and Pixabay Content License restrictions, especially visible trademarks, logos, and recognizable people.
