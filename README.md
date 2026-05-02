# Vue Query POC Monorepo

A small monorepo that compares the same async flows implemented in two ways:

- `Pinia` with manual loading, error handling, cache awareness, and optimistic UI management
- `TanStack Query` with declarative fetching, retries, cache invalidation, and background sync

The repo is structured so people can explore it quickly from LinkedIn or GitHub without guessing where things live.

## Repo Layout

```text
apps/
  backend/   Express demo API with delayed responses and an unstable endpoint
  frontend/  Vue 3 + Vite app that compares Pinia vs TanStack Query side by side
[POC.md](./POC.md)  Longer write-up explaining the architectural tradeoffs
```

## Quick Start

Requirements:

- `pnpm`
- Node.js 20+

Install dependencies:

```bash
pnpm install
```

Start the full demo:

```bash
pnpm dev
```

That starts:

- frontend at `http://localhost:5173`
- backend at `http://localhost:3000`

## Useful Commands

```bash
pnpm dev
pnpm dev:frontend
pnpm dev:backend
pnpm build
```

## What To Explore

- `/native/*` routes show the manual Pinia approach
- `/query/*` routes show the TanStack Query approach
- product details show repeated fetch behavior vs caching
- order creation shows manual vs managed optimistic updates
- unstable API shows manual retries vs automatic retries

## Notes

- The frontend reads the backend URL from `VITE_API_URL` and defaults to `http://localhost:3000`.
- The backend uses in-memory data for demo purposes, so restarting it resets products and orders.
- [`POC.md`](./POC.md) contains the longer narrative and comparison notes used for the post/write-up.
