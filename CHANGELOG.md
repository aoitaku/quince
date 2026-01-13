# Changelog

## 1.0.0 - 2026-01-14

- Migrate build/tooling to Vite + Vitest and split config files (`vite.config.ts`, `vitest.config.ts`).
- Modernize TypeScript setup (`tsconfig.json`, `tsconfig.build.json`) and add `build:types`/`typecheck`.
- Remove lodash usage from `Layouter`, fix `chunkBy` edge cases, and expand layout tests.
- Switch from TSLint to ESLint (typescript-eslint) and allow `_`-prefixed unused vars.
- Align output layout to `lib/` + `types/` with `exports`/`files` in `package.json`.
- Add build pipeline (`clean` → `build:types` → `vite build`) and keep `clean` for `types`.
- Add canvas rendering example under `examples/canvas/` and document example usage.
- Update README with build/test/lint and example commands.
