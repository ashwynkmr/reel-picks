# 0003. Link trailers via YouTube search unless an id is verified

- **Status:** Accepted
- **Date:** 2026-09-27

## Context

The result card needs a trailer link. Hard-coding YouTube video ids is fragile: studios re-upload,
regional channels go private, and a dead link is only discovered when a user clicks it, which is the
worst possible moment in this product.

## Decision

Each movie has an optional `youtubeId`. When present, link straight to it. When absent, link to a
YouTube search for `"<title> <year> official trailer"`. The same pattern applies to IMDb (`imdbId`,
falling back to an IMDb title search).

## Consequences

- **Gained:** links never 404, and the catalogue can grow without checking 150 video ids by hand.
- **Gave up:** one extra click (the search results page) for films without a verified id.
- **Revisit when:** a refresh script can verify ids automatically; the field already exists.
