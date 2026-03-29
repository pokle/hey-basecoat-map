# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A responsive map application displaying hang gliding waypoints for the Corryong Cup competition. Built with vanilla TypeScript, Vite, TailwindCSS, Basecoat UI, and MapBox GL JS.

## Development Commands

```bash
bun run dev      # Start development server
bun run build    # Type-check with tsc, then build for production
bun run preview  # Preview production build locally
```

## Environment Setup

Copy `.env.example` to `.env` and set your MapBox access token:
```
VITE_MAPBOX_TOKEN=your_mapbox_access_token_here
```

Get a free token at https://account.mapbox.com/

## Architecture

### Application Structure

- **Header** (`index.html`): App name with hamburger menu (mobile only via `md:hidden`)
- **Waypoint Panel** (`#waypoint-panel`): Left sidebar with search and scrollable waypoint list
  - Desktop: Always visible, positioned relative
  - Mobile: Hidden by default (`-translate-x-full`), slides in when toggled, floats over map (`absolute`)
- **Map** (`#map`): MapBox GL JS map filling remaining space

### Key Files

- `src/main.ts` - Application entry point with all logic:
  - CSV parsing and waypoint data model
  - MapBox map initialization with markers and popups
  - Waypoint selection with `flyTo` animation
  - Search filtering
  - Mobile panel toggle behavior
- `src/style.css` - TailwindCSS/Basecoat imports plus custom waypoint item styles
- `vite.config.ts` - Vite configuration with TailwindCSS plugin

### Data

Waypoints loaded from `public/corryong-cup-waypoints.csv` with columns: Name, Latitude, Longitude, Description, Proximity Distance, Altitude.

### Responsive Behavior

- Breakpoint: `md` (768px)
- Mobile: Hamburger menu toggles panel; selecting waypoint auto-closes panel
- Desktop: Panel always visible; hamburger menu hidden

### Tech Stack

- **Vite 7.x** with `@tailwindcss/vite` plugin
- **TypeScript** - Strict mode enabled
- **TailwindCSS 4.x** - Utility-first CSS
- **Basecoat CSS** - Component classes (`btn`, `input`, `scrollbar`)
- **MapBox GL JS** - Map rendering with markers and popups
