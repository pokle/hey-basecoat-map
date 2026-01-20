# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A responsive map application displaying hang gliding waypoints for the Corryong Cup competition. Built with vanilla TypeScript, Vite, TailwindCSS, Basecoat UI, and MapBox GL JS.

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Type-check with tsc, then build for production
npm run preview  # Preview production build locally
```

## Architecture

### Target Application Structure

- **Header**: App name, hamburger menu (mobile only) to toggle waypoint list
- **Waypoint List Panel**: Left side panel listing waypoints from CSV; floats over map on mobile
- **Map**: MapBox GL JS map filling remaining screen space
- **Responsive Behavior**: On mobile, tapping a waypoint hides the list to show the map

### Data

Waypoints are stored in `public/corryong-cup-waypoints.csv` with columns: Name, Latitude, Longitude, Description, Proximity Distance, Altitude.

### Tech Stack

- **Vite 7.x** - Build tool and dev server
- **TypeScript** - Strict mode enabled with `noUnusedLocals` and `noUnusedParameters`
- **TailwindCSS** - Utility-first CSS (to be installed)
- **Basecoat UI** - Component library built on TailwindCSS (to be installed)
- **MapBox GL JS** - Map rendering (to be installed)

### Key Configuration

- TypeScript targets ES2022 with bundler module resolution
- ES modules (`"type": "module"` in package.json)
- Source files in `src/`, static assets in `public/`

## Library Documentation

When implementing, consult:
- TailwindCSS: https://tailwindcss.com/docs
- Basecoat UI: https://basecoatui.com/
- MapBox GL JS: https://docs.mapbox.com/mapbox-gl-js/
