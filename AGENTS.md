# AGENTS

Guidance for human and AI contributors working on this repository.

## Project Snapshot

- Name: `roam-tools`
- Purpose: Browser-based text transformation helpers for Roam Research exports
- Stack: Vanilla JS + jQuery, Remarkable, Bun package manager/bundler/runtime

## Local Workflow

1. Install dependencies: `bun install`
2. Run dev server: `bun run dev`
3. Build production bundle: `bun run build`

## Working Agreements

- Keep changes small and focused; avoid broad refactors unless requested.
- Preserve current UX behavior unless the task explicitly changes it.
- Prefer plain JavaScript and existing project patterns.
- Avoid introducing new dependencies unless there is a clear maintenance benefit.
- Update docs (`readme.md`, `docs/netlify.md`) when scripts or deployment behavior changes.

## Release/Deploy Notes

- Netlify build command: `bun run build`
- Netlify publish directory: `dist/`
- Bun version pin is maintained in `netlify.toml` via `BUN_VERSION`

## Maintenance Checklist

- Run `bun outdated` and evaluate non-breaking dependency updates.
- Run `bun run test` and `bun run build` before creating PRs.
- Run `bun run build` before creating PRs.
- Keep lockfile (`bun.lock`) committed with dependency changes.
