# Contributing

## Workflow

- Branch from `main` (`phase-1/core-picker`, `data/add-heat-1995`, `fix/empty-state-copy`).
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/):
  `feat:`, `fix:`, `docs:`, `chore:`, `data:`, `test:`.
- Open a pull request; the template asks for the user problem, tradeoffs and testing.
- CI must pass. Run `npm run check` locally first.

## Adding or correcting a movie

1. Edit `src/data/catalogue.json`. The shape is defined in `src/domain/catalogue.ts`.
2. `id` is the kebab-case title plus year, e.g. `heat-1995`.
3. Only list platforms where it streams **with a subscription** in the US (not rent or buy).
4. Prefer originals and studio-owned titles ([why](docs/decisions/0005-prefer-owned-titles.md)).
5. Synopsis: 2-3 sentences, no spoilers, 280 characters max, in your own words.
6. Set `classic: true` only for IMDb Top 250 calibre films ([criteria](docs/decisions/0004-classics-as-a-flag.md)).
7. Run `npm run validate:data` and check the coverage grid.

## Making a product or technical decision

If a change involves a real tradeoff, add a short record in `docs/decisions/` (copy an existing one)
and link it from the PR.
