# Netlify Deployment Notes

This project is configured for static deployment on Netlify.

## Current Build Settings

- Config file: `netlify.toml`
- Base directory: `/`
- Build command: `bun install --frozen-lockfile && bun run build`
- Publish directory: `dist/`
- Bun version pin: `BUN_VERSION = "1.3.9"`

## How It Works

1. Netlify installs Bun using the configured `BUN_VERSION`.
2. Netlify runs `bun install --frozen-lockfile` to install exact locked dependencies.
3. Netlify runs `bun run build`.
4. Netlify serves the generated files from `dist/`.

## Local Verification

Before pushing deployment-related changes, run:

```bash
bun install
bun run build
```

If the build succeeds locally, the Netlify build should match.
