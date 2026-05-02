# Frontend

Vue 3 + Vite app that renders the same product and order flows twice:

- `Pinia` under `/native/*`
- `TanStack Query` under `/query/*`

The UI is intentionally opinionated toward learning:

- slow backend responses make loading states visible
- repeated navigation highlights cache differences
- silent updates show refetch behavior
- unstable API routes demonstrate retry handling

## Commands

```bash
pnpm dev
pnpm build
pnpm preview
```

## Environment

`VITE_API_URL` defaults to `http://localhost:3000`.
