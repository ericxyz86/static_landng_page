# AI LABS Landing Page

The public site for **AI LABS** (Agile Intelligence @ DDB Group Philippines), live at [aiailabs.net](https://aiailabs.net) — a landing page plus a catalog of 26 AI-powered tools for marketing intelligence, data analytics, and competitive research.

Pure HTML/CSS/JS. No framework, no build step, no package manager.

## Pages

- **`index.html`** — Landing page: GSAP curtain-reveal hero, capability pillars, Featured Work accordion, Nox AI showcase
- **`apps.html`** — Full app catalog, rendered client-side from `static/data/apps.json`
- **`index-agile.html`** — Agile Intelligence cinematic variant with a scroll-synced video hero
- **`appscript.html`** — Google Sheets AI script documentation
- **`privacy-policy.html`** / **`reddit-setup.html`** — Support pages

## Features

- Dark-first design with a persistent light/dark theme toggle (no flash of wrong theme)
- JSON-driven app catalog — add or edit a card by editing `static/data/apps.json`, no HTML changes
- Responsive throughout: the catalog grid scales from 1 column on phones to 6 on wide monitors; the accordion collapses to stacked rows
- Single shared design system in `static/css/style-v3.css`

## Structure

```
├── index.html
├── apps.html
├── index-agile.html
├── appscript.html
├── privacy-policy.html
├── reddit-setup.html
└── static/
    ├── css/style-v3.css        # design system
    ├── data/apps.json          # canonical app registry
    ├── js/main.js              # theme toggle + navigateToApp()
    ├── js/apps-catalog.js      # renders apps.html from apps.json
    └── images/app-previews/    # 1408×768 card preview renders
```

## Adding an App

Edit `static/data/apps.json` (name, description, URL, `badgeNew` flag) and drop a 1408×768 JPG preview into `static/images/app-previews/`. See [CLAUDE.md](CLAUDE.md) for the full field reference and conventions.

## Local Development

```bash
python3 -m http.server 8000
# or
npx serve .
```

## Deployment

Pushes to `main` deploy automatically to production — treat every push as a release.
