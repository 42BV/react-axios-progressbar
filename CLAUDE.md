# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Full test suite** (lint + typecheck + coverage): `npm test`
- **Run tests in watch mode**: `npm run test:watch`
- **Run a single test file**: `npx vitest run tests/useProgressBarMode.test.ts`
- **Run a single test by name**: `npx vitest run -t "should set mode to init"`
- **Type check only**: `npm run test:ts`
- **Lint**: `npm run lint`
- **Build** (clean + compile to `lib/`): `npm run tsc`
- **Release**: `npm run release` (builds then uses `np` for publishing)

## Architecture

This is a small React library (3 source files) that shows a progress bar whenever an Axios request is in progress. It is published as an npm package with `lib/` as the output.

### State machine (`useProgressBarMode.ts`)

The core logic is a 4-state machine driving the progress bar animation:

```
hibernate → init → active → complete → hibernate
```

- **hibernate**: bar is invisible, no animation
- **init**: request detected, waits 100ms before showing (avoids flicker for fast requests)
- **active**: bar animates slowly to 80%
- **complete**: bar animates quickly to 100%, then returns to hibernate after 1s

Transitions use debounce timeouts (100ms, 200ms, 1000ms) to avoid flickering on rapid request sequences.

### Request tracking (`useActiveRequests.ts`)

Registers Axios interceptors (request + response) to track in-flight request count. Interceptors are ejected on cleanup. The count never goes below 0.

### Component (`index.tsx`)

The `ProgressBar` component renders a positioned `<div>` with CSS transition-based animation. Accepts an `axiosInstance` prop and optional `style` overrides. The `style` prop is spread onto the bar's inline styles (but `width` and `transition` are always controlled by the mode).

## Key Conventions

- **100% test coverage required** — branches, functions, lines, and statements are all enforced at 100%
- Tests live in `tests/` and use `@testing-library/react` with `renderHook` and Vitest fake timers
- Tests mock React hooks via `vi.mock('react', ...)` with `vi.hoisted()` (ESM-compatible approach)
- ESLint 9 flat config (`eslint.config.mjs`) with `typescript-eslint`
- Prettier: single quotes, no trailing commas, double quotes in JSX
- Pre-commit hook runs `lint-staged` (Prettier formatting)
- TypeScript strict mode; only `src/index.tsx` is in the compilation (other src files are pulled in via imports)
- Peer dependencies: axios (^0.27.2 || ^1.0.0), React (^17 || ^18 || ^19)
