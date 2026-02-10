## roam-tools.ryanguill.com

A collection of tools to transform roamresearch.com content into different formats for sharing.

### prerequisites

- Bun `1.3.9`+

### develop

`bun install`
`bun run dev`

This starts a local dev server at `http://localhost:3000`, watches source files, and rebundles into `dist/` using Bun's bundler.

### deploy

`bun run build`

### test

`bun run test`

### netlify

- Build command: `bun install --frozen-lockfile && bun run build`
- Publish directory: `dist/`
- See `docs/netlify.md` for full configuration notes

### future maintenance notes

- Candidate cleanup: remove `jquery` and migrate `src/index.js` to native DOM APIs in a dedicated follow-up branch.
- Scope estimate: low-to-medium; all jQuery usage is in `src/index.js` and mostly maps directly to `querySelector`, `addEventListener`, `classList`, `closest`, and `dataset`.
- Risk area to retest carefully: the `label.toggle-on-click` handler behavior when clicking nested elements, to ensure selection toggling still matches current UX.
- Expected outcome: remove `jquery` from dependencies and shrink bundle size while keeping behavior unchanged.
- Repo housekeeping todo: rename default branch from `master` to `main` (local rename, push new branch, update GitHub default/protection rules, then optionally delete `master` after verification).
