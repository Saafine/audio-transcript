# CLAUDE.md

Guidance for working in this repository.

## Hard rules

- **Never install, add, remove, or upgrade dependencies without explicit permission.** Do not run any install/add command (or anything that mutates `node_modules` or a lockfile) until the user asks for it. If a task seems to need a new package, stop and ask first.
- **Use pnpm only.** Do not use `npm` or `yarn` for any operation. All scripts, installs, and tooling go through `pnpm`. (A `package-lock.json` is still checked in from the project's npm history — ignore it; the canonical lockfile for this repo going forward is `pnpm-lock.yaml`.)
- `.npmrc` sets `frozen-lockfile=true` and `ignore-scripts=true`. Installs require an in-sync `pnpm-lock.yaml` and will not run package lifecycle scripts. `save-exact=true` means no `^`/`~` ranges — pin exact versions.

## What this is

A single-page React + TypeScript app (bootstrapped with Create React App / `react-scripts`) that plays a fixed audio file and renders its transcript with:
- a waveform-style "weave" view with per-speaker noise markers and a seekable progress overlay,
- a synchronized, searchable transcript where the currently-spoken word is highlighted,
- transport controls (play/pause, ±10s, playback speed).

The audio (`public/59e106639d79684277df770d.wav`) and transcript (`src/Transcript/transcript.json`) are static, bundled assets — there is no backend.

## Commands (pnpm)

- `pnpm start` — dev server (react-scripts).
- `pnpm test` — Jest via react-scripts (watch mode by default; use `CI=true pnpm test` for a single run).
- `pnpm build` — production build.
- `pnpm build:tailwind` — regenerate `src/styles/tailwind.output.css` from `src/styles/tailwind.css` via postcss.

Built on react-scripts 5 (webpack 5); styles use Dart `sass`; linting is ESLint 8 + `@typescript-eslint` 5 (runs on build and via the standalone `.eslintrc.js`). Dependency versions are pinned exactly (no `^`/`~`) per `save-exact=true`.

## Architecture

State is managed with `useReducer` + typed discriminated-union actions — there is no Redux or context store.

- **`src/AudioPlayer/`** — top-level feature.
  - `AudioPlayer.tsx` owns the audio reducer state (`paused`, `durationMs`, `currentTimeMs`, `speed`) and the `play`/`pause`/`seek`/`forward`/`rewind`/`setSpeed` callbacks. Renders `ControlBar`, `TimeProgress`, `WeaveForms`, `Transcript`.
  - `useAudio(dispatch)` creates the single `HTMLAudioElement` and wires `canplay`/`ended`/`timeupdate` listeners to reducer actions.
  - `useTranscript()` loads and maps the transcript JSON once on mount.
  - `audio-player.actions.ts` / `audio-player.reducer.ts` — action constants, action union, reducer.
- **`src/Transcript/`** — transcript data + view.
  - `transcript-utils.ts` — pure helpers: JSON→model mapping, time-string→ms parsing, caller A/B split, talk-time percentage. **Keep these pure and tested.**
  - `interfaces.ts` — shared types (`WordTiming`, `TranscriptModel`, etc.).
  - `Transcript.tsx` / `TranscriptBlock.tsx` — searchable list; word highlight via `startTimeMs <= currentTimeMs < endTimeMs`.
  - `weave-forms.actions.ts` / `weave-forms.reducer.ts` — state for the weave view (used by `WeaveForms`).
- **`src/WeaveForms/`** — the waveform visualization (`WeaveForms` orchestrates, with `WeaveBars`, `Timeline`/`TimelineBase`, `WeaveProgress`, `VoiceOwner`). `noise-marking-utils.ts` maps word timings to bar indices.
- **`src/TimeProgress/`**, **`src/ControlBar/`**, **`src/Dropdown/`** — presentational pieces.
- **`src/App.theme.tsx`** — shared layout/color constants. Prefer these over inline magic numbers/colors.

### Units convention (important)

Time is handled in **milliseconds** throughout state and props (fields are suffixed `Ms`). The only place seconds appear is at the `HTMLAudioElement` boundary (`audio.currentTime` is seconds) — convert right at that boundary and keep everything else in ms. Mismatching this is an easy and high-impact bug.

## Conventions

- TypeScript strictness matters here — avoid `any`; type reducer payloads via the action unions.
- Reference action types by their exported `*_ACTIONS_*` constants, never raw string literals.
- Styling is Tailwind utility classes plus per-component `.scss`. Edit `tailwind.css` (source), not `tailwind.output.css` (generated).
- Tests live next to the code (`*.test.ts[x]`); the testable logic is the pure utils in `transcript-utils.ts`, `time.utils.ts`, and `noise-marking-utils.ts`.
