# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static landing page for AI LABS (Agile Intelligence @ DDB Group Philippines) showcasing 23 AI-powered tools organized by category. Minimalist dark-first design inspired by Linear/Vercel. No build system, no framework — pure HTML/CSS/JS.

## Architecture

### Core Structure
- **Static Site**: Pure HTML/CSS/JS, no build tools or package manager
- **Authentication**: Cloudflare Access (external) — no client-side auth code
- **Styling**: Custom CSS with CSS custom properties for theming (`style-v3.css`)
- **JavaScript**: ~25 lines total — theme toggle + `navigateToApp()` only

### Key Files
- `index.html` — Landing page: hero, 4 featured apps, capabilities, footer
- `apps.html` — Full catalog: 23 apps in 5 categories
- `appscript.html` — Google Apps Script documentation and code viewer
- `privacy-policy.html` — Privacy policy for Chrome extension
- `static/css/style-v3.css` — Complete design system (~280 lines)
- `static/js/main.js` — Theme toggle + navigateToApp()

### Design System (style-v3.css)
- **Dark theme** (default): `#09090b` bg, `#18181b` surfaces, `#27272a` borders
- **Light theme**: `#ffffff` bg, `#f4f4f5` surfaces, `#e4e4e7` borders
- **Accent**: Single blue `#3b82f6`
- **Font**: Inter + system stack
- **Radius**: 12px cards, 8px buttons/images
- **Transitions**: 150-200ms ease on border-color only — no lifts, no scale
- All colors via CSS custom properties, swapped via `html.dark` selector

### Theme Toggle
- Sun/moon SVG icons in nav
- Inline `<script>` in `<head>` prevents flash of wrong theme
- Checks `localStorage.theme`, falls back to `prefers-color-scheme`
- `toggleTheme()` in main.js flips class + persists preference

## Development

### Local Development
```bash
python -m http.server 8000
# or
npx serve .
```

### File Organization
```
/
├── index.html
├── apps.html
├── appscript.html
├── privacy-policy.html
├── reddit-setup.html
└── static/
    ├── css/
    │   └── style-v3.css
    ├── js/
    │   └── main.js
    └── images/
        ├── ailabs.png
        └── app-previews/    # 16:9 preview images for each app
```

### App Categories (apps.html)
1. **Data Extraction & Scraping** (7 apps)
2. **Brand & Market Intelligence** (6 apps)
3. **Telecom & Industry** (2 apps)
4. **AI & Research Tools** (5 apps)
5. **Productivity & Utilities** (3 apps)

### Code Patterns
- `navigateToApp(url)` opens all external apps in new tabs
- Inline `onclick` with `event.preventDefault()` on card buttons
- No IntersectionObserver, no entrance animations, no scroll effects
- Prism.js used only on appscript.html for code highlighting
- SVG icons throughout (no emoji icons per CLAUDE.md global rule)
