# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static landing page for AI LABS (Agile Intelligence @ DDB Group Philippines) showcasing 26 AI-powered tools organized in 5 categories. Minimalist dark-first design inspired by Linear/Vercel. No build system, no framework, no package manager — pure HTML/CSS/JS.

This repo is **public** and its files (including this one) are served verbatim on the production site — never commit secrets, tokens, or internal infrastructure identifiers.

## Architecture

### Core Structure
- **Static site**: plain HTML/CSS/JS; the only external dependency is GSAP (CDN) on the landing pages
- **Authentication**: none on the landing page itself; the individual apps it links to sit behind Cloudflare Access
- **Styling**: shared design system in `static/css/style-v3.css`; `index.html` and `index-agile.html` carry their own inline `<style>` blocks for page-specific sections
- **App catalog**: `apps.html` is a thin shell — cards are rendered client-side by `static/js/apps-catalog.js` from `static/data/apps.json`

### Key Files
- `index.html` — Landing page: GSAP curtain-reveal hero, capability pillars, Featured Work accordion slider (8 panels), Nox AI section, tech stack, CTA
- `index-agile.html` — Agile Intelligence cinematic variant: scroll-synced video hero (frame sequence scrubbed via GSAP ScrollTrigger)
- `apps.html` — Full catalog shell; renders all apps from `apps.json`
- `appscript.html` — Google Apps Script documentation and code viewer (Prism.js)
- `privacy-policy.html` — Privacy policy for the Chrome extension
- `reddit-setup.html` — Setup guide for the Reddit Comment Extractor
- `static/data/apps.json` — Canonical app registry (also consumed for uptime monitoring)
- `static/js/apps-catalog.js` — Fetches `apps.json`, renders category sections and cards, escapes all values
- `static/js/main.js` — Theme toggle + `navigateToApp()`
- `static/css/style-v3.css` — Shared design system (~280 lines)

## App Catalog (apps.json)

To add or update an app card, edit `static/data/apps.json` — no HTML changes needed.

Card fields:
```json
{
  "id": "kebab-case-id",
  "name": "Display Name",
  "description": "One-line description shown on the card.",
  "image": "static/images/app-previews/<id>.jpg",
  "badgeNew": true,
  "appUrl": "https://<subdomain>.aiailabs.net",
  "links": [{ "label": "Launch App", "url": "https://<subdomain>.aiailabs.net" }],
  "monitor": true,
  "hibernated": false
}
```

Conventions:
- Preview images are **1408×768 JPG** dark sci-fi 3D renders (Nano Banana / Gemini image gen), stored in `static/images/app-previews/`
- `badgeNew: true` renders a "New" pill next to the title — set it on genuinely new apps and clear it from older ones at the same time
- `hibernated: true` renders a gray "Hibernate" pill for parked apps
- Multiple `links` render as a button row (e.g. Download + User Guide)
- Bump the top-level `updatedAt` timestamp on every edit
- When featuring a new flagship app, also update the Featured Work accordion in `index.html` (add a panel, renumber, and retire stale "✦ New" tags)

### Current Categories
1. **Data Extraction & Scraping** (7 apps)
2. **Brand & Market Intelligence** (9 apps)
3. **Telecom & Industry** (2 apps)
4. **AI & Research Tools** (5 apps)
5. **Productivity & Utilities** (3 apps)

## Design System (style-v3.css)
- **Dark theme** (default): `#09090b` bg, `#18181b` surfaces, `#27272a` borders
- **Light theme**: `#ffffff` bg, `#f4f4f5` surfaces, `#e4e4e7` borders
- **Accent**: single blue `#3b82f6` (landing sections also use accent CSS vars: green, purple, pink, cyan)
- **Font**: Inter + system stack
- **Radius**: 12px cards, 8px buttons/images
- **Transitions**: 150–200ms ease; catalog cards animate border-color only — no lifts, no scale
- All colors via CSS custom properties, swapped via the `html.dark` selector

### Theme Toggle
- Sun/moon SVG icons in nav
- Inline `<script>` in `<head>` prevents flash of wrong theme
- Checks `localStorage.theme`, falls back to `prefers-color-scheme`
- `toggleTheme()` in main.js flips the class + persists the preference

## Development

```bash
python3 -m http.server 8000
# or
npx serve .
```

## Deployment

Pushes to `main` **auto-deploy to production** (aiailabs.net) via a GitHub webhook into the hosting platform — a push is live within seconds, so treat every push to `main` as a production release. The apex `/` 301-redirects to `/index.html`; Cloudflare proxies the site and injects its email-obfuscation script.

Cloudflare caches static assets (CSS) at the edge but not HTML, so `style-v3.css` is linked with a `?v=YYYYMMDD` cache-busting query. **Whenever the CSS changes, bump the version in every page that links it** (`apps.html`, `appscript.html`, `privacy-policy.html`) — otherwise the old stylesheet keeps being served for hours after deploy.

## Code Patterns
- `navigateToApp(url)` opens external apps in new tabs; catalog buttons use inline `onclick` with `event.preventDefault()`
- `apps-catalog.js` HTML-escapes every value from `apps.json` before injecting
- Landing-page motion: GSAP + ScrollTrigger (curtain hero), IntersectionObserver fade-ups, mousemove spotlight on pillars; catalog pages have no scroll effects
- Prism.js used only on `appscript.html` for code highlighting
- Icons: SVG in nav, footer, and catalog UI (per the global no-emoji-icons rule); some index.html sections (pillars, Nox) still use emoji glyphs as decorative accents — prefer SVG for new work
