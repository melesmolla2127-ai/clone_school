# Clone School

Clone School is a frontend-only React + Vite educational app for Ethiopian students. It includes authentication, courses, games, EUEE practice/mock exams, a historical EUEE archive, a locked Scholar Course preview, profile, settings, notifications, and local progress tracking.

## Tech Stack

- React 19 + Vite
- React Router
- JavaScript
- CSS
- Lucide React
- LocalStorage for demo persistence

## Project Structure

```text
clone-school/
  public/
  src/
    assets/
    components/
    context/
    data/
    hooks/
    layouts/
    pages/
    routes/
    services/
    styles/
    utils/
  netlify.toml
  vercel.json
  vite.config.js
```

## Local Development

```bash
cd clone-school
npm install
npm run dev
```

## Quality Checks

```bash
npm run lint
npm run build
npm run preview
```

## Deployment

The app is a SPA and includes redirect configuration for Netlify/Vercel.

### Netlify

1. Push the repository to GitHub/GitLab/Bitbucket.
2. In Netlify, create a new site from Git.
3. Set **Base directory** to `clone-school` (if deploying from the repo root).
4. Set **Build command** to `npm run build`.
5. Set **Publish directory** to `dist`.
6. Deploy. `netlify.toml` and `public/_redirects` handle SPA routing.

### Vercel

1. Push the repository to Git.
2. Import the project in Vercel.
3. Set **Root Directory** to `clone-school`.
4. Framework preset: **Vite**.
5. Build command: `npm run build`.
6. Output directory: `dist`.
7. Deploy. `vercel.json` handles SPA rewrites.

### Manual / CLI

```bash
cd clone-school
npm install
npm run build
# deploy the dist/ folder to any static host with SPA fallback to /index.html
```

## Important Notes

- **Frontend-only demo:** Accounts, progress, notifications, and settings are stored in browser LocalStorage.
- **Not production-secure auth:** Passwords/session data are not protected by a backend. Do not use real credentials.
- **EUEE Historical Archive:** Years 2000 E.C. through current E.C. are listed. Only imported question sets with recorded source/verification status are available; missing years/subjects are intentionally marked unavailable. Imported public archive items are labeled as imported/unverified unless independently verified.
- **Scholar Course:** Visible but locked by design; route/content is not accessible.

## Stage 10-12 Additions

- Historical EUEE archive data model, year/stream/subject browser, exam flow, results, and archive progress.
- Scholar Course locked premium card and protected route.
- Final QA fixes, SPA deployment config, and production build verification.
