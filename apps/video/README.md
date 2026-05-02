# TanStack Query Video

This project is a Remotion video that compares pagination and async UI behavior without TanStack Query vs with TanStack Query.

The current video focuses on:
- the pain of full-table loading resets
- stale data plus background fetching
- better developer experience with Vue Query
- a final CTA that rotates supported TanStack Query frameworks

## Current Output

- Composition ID: `MyComp`
- Resolution: `1920x1080`
- Frame rate: `30fps`
- Total duration: `1197` frames, about `39.9s`
- Global watermark: `/in/AhmedSabryFR`

The full composition is defined in [src/Root.tsx](/home/ahmed-sabry/Desktop/Posts%20Material/video/src/Root.tsx) and [src/Composition.tsx](/home/ahmed-sabry/Desktop/Posts%20Material/video/src/Composition.tsx).

## Story Structure

The video is split into 2 acts with a slide transition between them.

### Act 1

`Part1WithoutTanstack` shows the frustrating baseline:
- table pagination causes visible loading resets
- the UI loses context on page changes
- narration emphasizes repeated loading pain

Main files:
- [src/scenes/Part1WithoutTanstack.tsx](/home/ahmed-sabry/Desktop/Posts%20Material/video/src/scenes/Part1WithoutTanstack.tsx)
- [src/scenes/part1/TableWithLoading.tsx](/home/ahmed-sabry/Desktop/Posts%20Material/video/src/scenes/part1/TableWithLoading.tsx)
- [src/scenes/part1/FrustrationClimax.tsx](/home/ahmed-sabry/Desktop/Posts%20Material/video/src/scenes/part1/FrustrationClimax.tsx)
- [src/scenes/part1/PersistentHeader.tsx](/home/ahmed-sabry/Desktop/Posts%20Material/video/src/scenes/part1/PersistentHeader.tsx)

### Act 2

`Part2WithTanstack` shows the improved flow:
- stale data stays on screen
- a header badge communicates background refetching and fresh data
- a developer-experience scene compares manual async state wiring with Vue Query
- a comparison slide summarizes the value
- the CTA rotates through supported frameworks and install packages

Main files:
- [src/scenes/Part2WithTanstack.tsx](/home/ahmed-sabry/Desktop/Posts%20Material/video/src/scenes/Part2WithTanstack.tsx)
- [src/scenes/part2/TableSmooth.tsx](/home/ahmed-sabry/Desktop/Posts%20Material/video/src/scenes/part2/TableSmooth.tsx)
- [src/scenes/part2/DeveloperExperience.tsx](/home/ahmed-sabry/Desktop/Posts%20Material/video/src/scenes/part2/DeveloperExperience.tsx)
- [src/scenes/part2/SplitComparison.tsx](/home/ahmed-sabry/Desktop/Posts%20Material/video/src/scenes/part2/SplitComparison.tsx)
- [src/scenes/part2/CallToAction.tsx](/home/ahmed-sabry/Desktop/Posts%20Material/video/src/scenes/part2/CallToAction.tsx)
- [src/scenes/part2/PersistentHeader.tsx](/home/ahmed-sabry/Desktop/Posts%20Material/video/src/scenes/part2/PersistentHeader.tsx)

## Timing

The global timing constants live in [src/utils/constants.ts](/home/ahmed-sabry/Desktop/Posts%20Material/video/src/utils/constants.ts).

Current values:
- `PART1_DURATION = 390`
- `PART2_DURATION = 825`
- `TRANSITION_DURATION = 18`
- `TOTAL_DURATION = 1197`

Part 2 local sections:
- `0-299`: smooth table and background refetching
- `300-494`: developer experience comparison
- `495-674`: split comparison and feature tags
- `675-824`: CTA

## Notable Components

- [src/components/DataTable.tsx](/home/ahmed-sabry/Desktop/Posts%20Material/video/src/components/DataTable.tsx)
  Reusable table shell, status pills, header indicator, and the internal highlight ring for the refreshing badge.

- [src/components/ActNarrationOverlay.tsx](/home/ahmed-sabry/Desktop/Posts%20Material/video/src/components/ActNarrationOverlay.tsx)
  Persistent narration text that is decoupled from table scene transitions.

- [src/components/AnimatedCursor.tsx](/home/ahmed-sabry/Desktop/Posts%20Material/video/src/components/AnimatedCursor.tsx)
  Cursor motion and click animation for pagination interaction.

- [src/components/SoundCue.tsx](/home/ahmed-sabry/Desktop/Posts%20Material/video/src/components/SoundCue.tsx)
  Thin wrapper around `@remotion/sfx` for short scene cues.

- [src/components/Watermark.tsx](/home/ahmed-sabry/Desktop/Posts%20Material/video/src/components/Watermark.tsx)
  Bottom-right LinkedIn-style watermark with looping ping-pong icon animation.

## Framework CTA

The last page currently rotates through:
- `React`
- `Vue`
- `Angular`
- `Solid`
- `Svelte`

It also swaps the install command on each beat:
- `@tanstack/react-query`
- `@tanstack/vue-query`
- `@tanstack/angular-query-experimental`
- `@tanstack/solid-query`
- `@tanstack/svelte-query`

## Commands

Install dependencies:

```bash
npm i
```

Start Remotion Studio:

```bash
npm run dev
```

Bundle the project:

```bash
npm run build
```

Run lint and type-check:

```bash
npm run lint
```

Render the current composition:

```bash
npx remotion render MyComp out/video.mp4
```

Upgrade Remotion packages:

```bash
npm run upgrade
```

## Stack

- `remotion`
- `@remotion/transitions`
- `@remotion/sfx`
- `react`
- `typescript`
- `tailwindcss`

## Editing Notes

- This project is tuned for `1080p` output. Many layout values scale through [src/utils/useCanvasScale.ts](/home/ahmed-sabry/Desktop/Posts%20Material/video/src/utils/useCanvasScale.ts).
- Scene narration is act-level, not table-local, so text can persist while the UI changes beneath it.
- The background refetch badge is intentionally absolute-positioned so it does not push table headers.
- The current CTA is framework-agnostic even though the DX comparison scene uses Vue Query examples.
