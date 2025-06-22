# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static landing page for AI Labs that showcases a collection of AI-powered applications. The site features a secure login system, dark mode support, and modern responsive design built with HTML5, CSS3, Tailwind CSS, and vanilla JavaScript.

## Architecture

### Core Structure
- **Static Site**: Pure HTML/CSS/JS with no build system or package manager
- **Authentication**: Client-side login using localStorage with hardcoded credentials
- **Styling**: Primarily Tailwind CSS via CDN with custom CSS overrides
- **JavaScript**: Vanilla JS with modular functionality split across files

### Key Files
- `index.html` - Main landing page with login overlay and app showcase
- `appscript.html` - Google Apps Script documentation and code viewer  
- `privacy-policy.html` - Privacy policy for Chrome extension
- `static/js/main.js` - Core functionality: dark mode, login, navigation, animations
- `static/js/auth.js` - Authentication helpers and URL protection
- `static/js/shader-background.js` - WebGL shader background with neural network effects
- `static/css/style.css` - Custom styles and dark mode overrides

### Authentication System
The site uses a simple client-side authentication:
- Login credentials: username `agileintel`, password `16f2worldsquare`
- Auth state stored in `localStorage.isLoggedIn`
- Protected routes redirect to index.html if not authenticated
- `navigateToApp()` function checks auth before opening external apps

### Design System
- **Brand Colors**: Primary `#2B3990` (blue), Secondary `#EE3124` (red)
- **Typography**: Default uses system fonts, Tailwind utility classes
- **Layout**: Responsive grid system, mobile-first approach
- **Animations**: CSS transitions, Intersection Observer for scroll effects

## Development

### Local Development
Since this is a static site, simply open `index.html` in a browser or serve via any static file server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```

### File Organization
```
/
├── index.html              # Main landing page
├── appscript.html         # Apps Script documentation
├── privacy-policy.html    # Privacy policy
└── static/
    ├── css/
    │   └── style.css      # Custom styles
    ├── js/
    │   ├── main.js        # Core functionality
    │   └── auth.js        # Authentication
    └── images/            # Static assets
```

### Featured Applications
The landing page showcases 5 AI applications:
1. Apple App Store Reviews Extractor (hosted on Render)
2. Google Play Store Reviews Extractor (hosted on Render)  
3. AI Webpage Summarizer Chrome Extension
4. Social Media Data Processor (hosted on Render)
5. Google Sheets App Script for AI

### Dark Mode Implementation
- Toggle button in navigation switches between light/dark modes
- Preference persisted in localStorage as `darkMode` key
- Custom CSS classes handle dark mode styling overrides
- Uses Tailwind's dark mode classes where possible

### Code Patterns
- Event listeners wrapped in `DOMContentLoaded` handlers
- Intersection Observer for scroll-based animations
- LocalStorage for client-side state persistence
- Inline onclick handlers for app navigation
- CSS-in-JS avoided in favor of utility classes
- WebGL shader implementation using OGL library via CDN import
- Performance monitoring for WebGL effects with automatic complexity reduction
- Graceful fallback to CSS gradients when WebGL is not supported

### WebGL Shader System
The site features a sophisticated WebGL shader background (`shader-background.js`):
- Neural network-inspired visual effects using fragment shaders
- Dynamic color updates for dark mode integration
- Mouse/touch interaction with subtle movement response
- Performance monitoring with automatic quality adjustment
- Accessibility support with `prefers-reduced-motion` detection
- Graceful degradation to CSS gradients on unsupported devices

### Important Implementation Details
- `navigateToApp()` function in `main.js:216` handles all external app navigation with auth checks
- Authentication state checking in `auth.js` protects specific paths and domains
- Dark mode toggle updates both CSS classes and WebGL shader colors
- All animations use CSS transitions with `Intersection Observer` for performance
- Multiple `DOMContentLoaded` handlers coordinate different subsystems