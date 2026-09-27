# 0005. Prefer originals and studio-owned films

- **Status:** Accepted
- **Date:** 2026-09-27

## Context

A static catalogue ([0001](0001-static-curated-catalogue.md)) goes stale as licensed films rotate
between services, often monthly. Films a platform produced or whose studio it owns rarely move:
Netflix originals stay on Netflix, Warner Bros. films on HBO Max, Disney/Marvel/Lucasfilm/Pixar on
Disney+, Searchlight and 20th Century on Hulu, MGM on Prime Video, Apple originals on Apple TV.

## Decision

When curating, prefer originals and studio-owned titles. Licensed titles are allowed but should be the
exception.

## Consequences

- **Gained:** the snapshot stays accurate for much longer with no maintenance.
- **Gave up:** some great licensed films, and balance. Platforms without a back catalogue (Netflix,
  Apple TV) have almost no classics, which the Phase 0 coverage grid made visible. The empty state
  handles it by suggesting another platform rather than pretending the gap doesn't exist.
