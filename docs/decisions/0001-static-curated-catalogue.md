# 0001. Ship a hand-curated catalogue, not a live API

- **Status:** Accepted
- **Date:** 2026-09-27

## Context

Showing where a film streams needs availability data. Options:

1. **Live API** (TMDB watch providers, which is sourced from JustWatch, or a paid availability API).
2. **Hand-curated JSON** committed to the repo.

A live API means API keys, a backend or proxy to hide them, rate limits, and a much larger catalogue
that is mostly films nobody wants on a Friday night.

## Decision

Ship a hand-curated `src/data/catalogue.json` of about 150 films, with an `asOf` date, validated in CI.

## Consequences

- **Gained:** zero backend, zero keys, instant load, works offline once cached. Every film is one we
  would actually recommend, which matters more for a single-pick product than raw breadth.
- **Gave up:** freshness. Availability will drift. We show the snapshot date in the UI and provide a
  "catalogue correction" issue template.
- **Revisit when:** reports of "not on that platform" exceed a handful a month, or we expand beyond
  the US. The next step would be a scheduled GitHub Action that refreshes availability from TMDB and
  opens a PR for review, keeping curation human.
