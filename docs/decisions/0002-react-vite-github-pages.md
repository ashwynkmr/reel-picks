# 0002. React + Vite + TypeScript, hosted on GitHub Pages

- **Status:** Accepted
- **Date:** 2026-09-27

## Context

The app is a single screen with rich animation (a spinning reel that hands off into an expanding
card). Options considered: a single HTML file with vanilla JS, or a React app built with Vite.

## Decision

React 19 + Vite + TypeScript (strict), styled with plain CSS custom properties, animated with a
motion library in Phase 3. Hosted on GitHub Pages via GitHub Actions.

## Consequences

- **Gained:** shared-layout animation (reel to card) in a few lines instead of hand-written FLIP
  maths; typed catalogue data catches mistakes at build time; components keep the 80s set pieces
  (marquee, tickets, projector) separate and readable.
- **Gave up:** a build step and ~75 KB gzipped of framework. Acceptable for a leisure app on home Wi-Fi.
- **Hosting:** Pages is free, lives next to the code, and deploys on every merge to `main`. Vercel
  would add per-PR preview links; worth switching if outside contributors appear.
