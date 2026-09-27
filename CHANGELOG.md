# Changelog

All notable changes, grouped by development phase. Format based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow [SemVer](https://semver.org/).

## [0.1.0] - 2026-09-27 - Phase 0: setup and data

### Added

- Vite + React 19 + strict TypeScript scaffold, oxlint, Prettier, Vitest.
- Domain model for movies, platforms and genres (`src/domain/catalogue.ts`).
- Curated catalogue of 76 films across 6 US platforms, with IMDb ratings and spoiler-free synopses.
- Catalogue validator with unit tests, plus a CLI that prints a platform x genre coverage grid.
- Trailer and IMDb link helpers with search fallbacks.
- CI (lint, format, typecheck, tests, data validation, build) and GitHub Pages deploy.
- Product docs: PRD, problem and opportunity, decision log (ADRs 0001-0005).
- Issue templates for features (problem-first), bugs and catalogue corrections; PR template.

### Found

- Coverage grid shows Netflix and Apple TV have no classics, Prime has one sci-fi film and Apple TV
  one thriller. Classics gap is structural (ADR 0005); the others get filled in Phase 4.
