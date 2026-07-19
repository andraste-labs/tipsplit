# TipSplit - Deployment Guide

## Overview
TipSplit is a **plain static site** (HTML/CSS/JS only) - no build tooling, no bundler,
no backend/server component. Deployment consists of publishing the `frontend/` folder
as-is to a static host.

## Hosting Platform
- **Platform:** Netlify (static hosting)
- **Publish directory:** `frontend/`
- **Build command:** _none_ (explicitly disabled in `netlify.toml`)
- **HTTPS:** Automatic via Netlify-managed TLS certificate

## Live URL
> Replace with your actual Netlify site URL after first deploy:
>
> `https://tipsplit.netlify.app`

On every deploy, verify:
- `index.html` loads with HTTP 200 over HTTPS
- `styles.css` and `app.js` resolve relative to `index.html` (check DevTools Network tab, no 404s)
- No console errors on load

## Repository Structure
```
frontend/
  index.html   # entry point
  styles.css   # linked relatively: <link rel="stylesheet" href="styles.css">
  app.js       # linked relatively: <script src="app.js"></script>
  README.md
```
This structure matches Netlify's `publish = "frontend"` config in `netlify.toml`,
so all assets resolve correctly with no path rewriting needed.

## First-Time Setup
1. Create a Netlify account and a new site ("Import from Git" or `netlify sites:create`).
2. In the Netlify dashboard, confirm:
   - Build command: **(empty)**
   - Publish directory: `frontend`
3. In GitHub repo settings, add secrets used by `.github/workflows/cd.yml`:
   - `NETLIFY_AUTH_TOKEN`
   - `NETLIFY_SITE_ID`
4. Push to `main` - the CD workflow deploys automatically.

## Redeployment Instructions
Any future change is deployed automatically:
1. Edit files under `frontend/` (`index.html`, `styles.css`, `app.js`).
2. Commit and push (or merge a PR) to `main`.
3. GitHub Actions `CD` workflow runs and publishes `frontend/` to Netlify production - **no build step executed**.
4. Confirm the live URL loads the updated content over HTTPS.

### Manual Redeploy (fallback)
If you need to redeploy without pushing code:
```bash
npx netlify-cli deploy --prod --dir=frontend
```
Or in the Netlify dashboard: **Deploys → Trigger deploy → Deploy site**.

## Local Preview (Docker)
```bash
# Dev preview with live-mounted files
docker compose --profile dev up
# -> http://localhost:8080

# Prod-like container (built nginx image)
docker compose --profile prod up --build
# -> http://localhost:8080/health for healthcheck
```

## Rollback
Netlify retains all previous deploys:
1. Go to **Deploys** in the Netlify dashboard.
2. Select a prior successful deploy.
3. Click **Publish deploy** to instantly roll back (no rebuild needed, since there is no build step).

## CI/CD Summary
- `ci.yml`: lints HTML/CSS/JS, smoke-tests the static server, builds/validates the Docker image.
- `cd.yml`: on merge to `main`, publishes `frontend/` directly to Netlify production with zero build tooling.
