# 0007. Empty states offer a one-tap fix, and filters show counts

- **Status:** Accepted
- **Date:** 2026-09-27

## Context

The Phase 0 coverage grid showed some combinations are empty by nature: Netflix and Apple TV own
almost no classics. A generic "no results" message leaves the user to guess which filter to change,
right at the moment the product promises to remove effort.

## Decision

1. **Show counts on every genre option** for the selected services, e.g. `Classics (0)`, so thin or
   empty shelves are visible before the user pulls the lever.
2. **When the result is empty, replace the lever with a fix:** up to two "Add <service>" buttons
   (services with the most matching films first) and "Try any genre" when that would work. Copy
   names the gap plainly, e.g. "Netflix has no classics in our catalogue right now."

## Consequences

- **Gained:** an empty result is one tap from a working one; the catalogue's real shape is honest
  and visible.
- **Gave up:** a little visual noise from the counts. Phase 2 can style them quietly.
- **Suggesting services a user doesn't pay for** could read as an upsell. Acceptable because the
  app has no commercial relationship with any service, and adding one only widens the filter for
  this session.
