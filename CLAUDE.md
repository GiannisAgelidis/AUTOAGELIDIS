# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Auto Agelidis — a bilingual (Greek/English) marketing + inventory site for a used
car/truck dealer in Komotini, Greece. Built on Next.js 16 (App Router) with Supabase
as the backend and ImageKit for vehicle photo hosting.

The project is early-stage: the data model (`supabase/migrations/`), domain enums
(`src/lib/enums.ts`), and full translation catalog (`messages/en.json`,
`messages/el.json`) already describe the intended feature set — a filterable car
listing, a car detail view, and an authenticated admin CRUD dashboard for managing
inventory — but only the homepage hero is currently implemented. Treat the message
keys and enums as the spec when building the corresponding pages.

## Commands

```bash
npm run dev      # start dev server (Turbopack, next 16)
npm run build     # production build
npm run start     # run production build
npm run lint       # eslint (eslint-config-next core-web-vitals + typescript)
```

There is no test suite/framework configured in this repo yet.

## Architecture

**Routing & i18n.** Every page lives under `src/app/[locale]/`; locale is `el`
(default) or `en`, configured in `src/i18n/routing.ts`. Locale detection/redirects
happen in `src/proxy.ts` (Next's middleware convention, just named `proxy.ts` in
this project) via `next-intl`'s middleware. Always use the navigation helpers from
`src/i18n/navigation.ts` (`Link`, `redirect`, `usePathname`, `useRouter`) instead of
`next/navigation` directly, so locale prefixes stay correct. Translation strings are
loaded per-locale from `messages/{locale}.json` (see `src/i18n/request.ts`).

**Data layer.** Postgres via Supabase. Schema lives in `supabase/migrations/`; the
`cars` and `car_images` tables are the core of the app, with vehicle attributes
(category, fuel type, transmission, color, features, etc.) constrained by SQL
`check` constraints. Those same domain values are mirrored as TS union types in
`src/lib/enums.ts` — when adding/renaming an enum value, update both the migration
and `enums.ts` together, and add a corresponding entry under `enums` in both
`messages/*.json` files.

**Supabase clients** (`src/lib/supabase/`) — pick the right one:
- `client.ts` — browser client, for Client Components.
- `server.ts` — server client bound to request cookies, for Server Components/Actions running as the current user.
- `admin.ts` — service-role client that bypasses RLS (`server-only`). Only import from admin routes/actions that have already verified an authenticated Supabase session — never expose to the client.

RLS on `cars`/`car_images` only grants public **read** access; there are no anon
write policies, so all inserts/updates/deletes must go through the admin client
after an auth check at the app layer.

**Images.** Vehicle photos are hosted on ImageKit (`@imagekit/next`); `car_images`
stores `imagekit_file_id` + `url` + `position` (drag-to-reorder, first = cover
photo per the `admin.form.dragToReorder` message key).

**Path alias.** `@/*` maps to `src/*` (see `tsconfig.json`).

## Environment

Required env vars (see `.env.local.example`): `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
`NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`, `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY`,
`IMAGEKIT_PRIVATE_KEY`.

A Supabase MCP server is configured in `.mcp.json` (project ref
`iktzivywptubdrexdwqo`, with docs/database/debugging/development/functions/
branching features) — prefer it over guessing when inspecting or modifying the
live Supabase project.
