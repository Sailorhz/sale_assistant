# Routinelle

Routinelle is the mobile-first skincare guidance application foundation for the France MVP.

This app is built with:

- Next.js App Router
- TypeScript
- Supabase Auth and PostgreSQL utilities
- Tailwind CSS
- shadcn/ui

## Local Setup

Install dependencies:

```bash
npm ci --legacy-peer-deps
```

Create local environment variables:

```bash
cp .env.example .env.local
```

Fill in the public Supabase values in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Do not commit `.env.local` or any Supabase secret/service-role key.

## Development

Start the app:

```bash
npm run dev
```

The development script uses Next.js with webpack because the current Next 16
Turbopack dev server can panic while compiling the auth proxy in this local
environment. Production builds still use the standard Next.js build pipeline.

Open:

```text
http://localhost:3000
```

## Verification

Run lint:

```bash
npm run lint
```

Run production build:

```bash
npm run build
```

Run tests:

```bash
npm run test
```

## Database

Apply migrations in `supabase/migrations` in filename order, then seed the MVP
catalog:

```bash
psql "$DATABASE_URL" -f supabase/seed/001_mvp_catalog.sql
```

If you use Supabase CLI, `supabase/seed.sql` includes the same seed and can be
picked up by `supabase db reset`.

The seed creates one published catalog version, one published rule version, and
four published France-market products covering cleanse, hydrate, protect, and
support routine steps.

## Project Structure

- `src/app/` contains route-level screens and route handlers.
- `src/app/(consumer)/` is reserved for public and consumer-facing flows.
- `src/app/admin/` is reserved for internal admin screens.
- `src/app/api/` is reserved for route handlers.
- `src/components/ui/` contains shadcn/ui primitives.
- `src/components/routinelle/` is reserved for product-specific components.
- `src/lib/supabase/` contains Supabase client utilities.
- `src/lib/domain/`, `src/lib/catalog/`, `src/lib/recommendation/`, `src/lib/safety/`, `src/lib/explanations/`, `src/lib/analytics/`, and `src/lib/validation/` are reserved for application logic.
- `supabase/migrations/` and `supabase/seed/` are reserved for database artifacts.
