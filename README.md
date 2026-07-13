# Vedika Ayurveda — Next.js E-commerce

A complete Ayurveda e-commerce app built with **Next.js 14 (App Router) + Prisma + (SQLite dev / Postgres-Neon prod) + Tailwind + Zustand + React Query + NextAuth + PayU**.

## Stack
- **Storefront & Admin** in a single Next.js app (route groups): `/` (store), `/admin` (admin).
- **Auth**: NextAuth credentials, roles `ADMIN` / `CUSTOMER`. Middleware protects `/account/*` and `/admin/*`.
- **State management** (see below): Zustand (cart + wishlist, persisted to localStorage) + React Query (admin) + NextAuth SessionProvider.
- **Payments**: PayU India hosted checkout with request hash + callback verification.
- **DB**: SQLite for local development (`file:./dev.db`), PostgreSQL (Neon) for production. The schema is engine-agnostic (no enums, no native arrays).

## Access / Login credentials
The app is seeded with two accounts (`prisma/seed.ts`):

| Role     | Email                | Password     |
|----------|----------------------|--------------|
| Admin    | `admin@vedika.in`    | `admin1234`  |
| Customer | `customer@vedika.in` | `customer123` |

- Storefront: browse, add to cart, wishlist, checkout (PayU).
- Admin: visit `/admin` and sign in with the **Admin** account above.
  To grant admin to any user, set their `role` to `"ADMIN"` in the database.

## Local setup (SQLite — no database server needed)
```bash
npm install
# .env already points DATABASE_URL to file:./dev.db — no Postgres required
npx prisma db push          # create tables in dev.db
npm run db:seed             # seed 12 products, 4 categories, 6 posts, 2 users
npm run dev                 # http://localhost:3000
```

## Production setup (Neon / Postgres)
1. Set `DATABASE_URL` in `.env` to your Neon connection string (see `.env.example`).
2. `npm run db:setup:prod` — generates the Postgres schema variant, runs `db push`, and seeds.
3. Or on Vercel, the `vercel-build` script handles schema generation + `db push` + `next build`.

## Scripts
- `npm run dev` — dev server
- `npm run build` — production build (`prisma generate` runs first)
- `npm run db:push` — sync local SQLite schema
- `npm run db:seed` — seed demo data
- `npm run db:setup:prod` — generate Postgres schema + push + seed (production DB)
- `npm run db:studio` — Prisma Studio

## State management
- **Zustand** — client cart and wishlist, persisted to `localStorage` so they survive reloads.
  - `src/store/useCart.ts` — `add`, `remove`, `updateQty`, `clear`, derived totals.
  - `src/store/useWishlist.ts` — `toggle`, `has`, `clear`.
- **React Query (`@tanstack/react-query`)** — all admin data fetching/mutations
  (`useQuery` / `useMutation` with query-key invalidation on save/delete). Wired in `src/app/providers.tsx`.
- **NextAuth SessionProvider** — session/`role` available via `useSession()` and server `auth()`.

## PayU
Set `PAYU_KEY`, `PAYU_SALT`, and `PAYU_MODE` (test|live) in env. The checkout API creates a pending order, redirects to PayU, and the callback (`/api/payu/callback`) verifies and marks the order PAID.

## Vercel deploy
1. Import repo → framework **Next.js**.
2. Add env vars: `DATABASE_URL` (Neon), `NEXTAUTH_URL` (your prod domain), `NEXTAUTH_SECRET`, `NEXT_PUBLIC_APP_URL`, `PAYU_*`.
3. Set build command to `npm run vercel-build` (or rely on the `vercel-build` script) — it generates the Postgres schema, runs `db push`, then builds.
4. Deploy. After first deploy, run `npm run db:setup:prod` once (locally with the prod `DATABASE_URL`, or via Vercel Shell) to seed data.

> The Prisma `postinstall` script generates the client automatically.

## Admin features
Implemented:
- **Dashboard**: counts, paid revenue, today's orders, low-stock alerts, recent orders.
- **Products**: full CRUD (dosha, images, ingredients, keywords) with **image upload** (saved to `public/uploads`).
- **Categories** & **Journal/Posts**: full CRUD with image upload.
- **Orders**: list with status filter + **detail page** (`/admin/orders/[id]`) showing items, address, payment.
- **Customers**: list + **detail page** (`/admin/customers/[id]`) with their orders, addresses, wishlist.
- **Reviews**: moderation list with delete.
- Storefront data is fetched with **React Query** (`src/hooks/useStore.ts`); admin uses React Query throughout.

> **Media uploads** write to `public/uploads` and work on Node/Dev. On Vercel (read-only FS) use a blob/object store (e.g. Vercel Blob) and swap `/api/upload` accordingly.
