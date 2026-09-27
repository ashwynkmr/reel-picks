# 0009. Self-host fonts; no third-party requests

- **Status:** Accepted
- **Date:** 2026-09-27

## Context

The theme needs four web fonts. Loading them from Google Fonts is one line of HTML, but it sends
every visitor's IP address to a third party and adds a DNS lookup and connection before text renders.

## Decision

Bundle the fonts with `@fontsource/*` packages. Vite fingerprints and serves them from our own origin.

## Consequences

- **Gained:** zero third-party requests, which matches the no-analytics stance
  ([ADR 0001](0001-static-curated-catalogue.md)); fonts are cached with the app and work offline.
- **Gave up:** Google's shared CDN cache, which browsers no longer share across sites anyway.
- **Related performance choice:** the film-grain overlay uses plain opacity rather than
  `mix-blend-mode`, because a full-screen fixed layer with a blend mode makes the browser
  re-composite the page on every scroll frame.
