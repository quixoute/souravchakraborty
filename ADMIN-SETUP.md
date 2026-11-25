# Portfolio admin dashboard

The private admin page is available at `/admin.html` after this branch is merged and GitHub Pages deploys it.

## First-time setup

1. Open [GitHub fine-grained personal access tokens](https://github.com/settings/personal-access-tokens/new).
2. Create a token with access restricted to the `quixoute/souravchakraborty` repository.
3. Grant **Repository permissions → Contents → Read and write**. Metadata read access is granted automatically.
4. Open the website's `/admin.html`, paste the token and connect.

The token is stored in `sessionStorage` for the current browser tab/session only. It is not written to the repository, local storage, or a server. Use a dedicated token and revoke it from GitHub settings whenever you no longer need it.

## What it does

- Add YouTube projects by URL; the dashboard extracts the 11-character video ID and shows the YouTube thumbnail.
- Choose a category and insert the project at the top (newest first) or at the end.
- Rename projects, change their YouTube URL, move them between categories, reorder with drag-and-drop or up/down controls, and delete them.
- Changes remain in the browser until **Publish Changes** is pressed.
- Publishing updates `portfolio-data.js` on the repository's `main` branch. GitHub Pages then deploys the change.

The public portfolio's existing renderer and visual design are not changed by the dashboard. The dashboard edits the existing data registry. Photography is excluded from the video-project editor because it uses separate image galleries.

## Security and deployment notes

This is a static GitHub Pages admin tool, not server-side authentication. Anyone who can obtain a valid repository-scoped token can publish changes; do not share the token. The page is marked `noindex`, but that is not access control. Keep the token private and revoke it if exposed.

Publishing writes directly to `main` using the GitHub Contents API. GitHub Pages deployment may take a short time after publishing. No GitHub token or secret is embedded in the website code.
