# Ipshopy Affiliate Backend

TypeScript/Express service powering Ipshopy’s standalone affiliate platform. Designed for cPanel-friendly deployment with modular features, manual payout workflows, and low-latency OpenCart integration.

## Getting Started

```bash
cp env.example .env
npm install
npm run dev
```

## Project Structure

```
src/
  app.ts              # Express app factory (CORS, helmet, rate-limit, raw body capture)
  server.ts           # Bootstrap + graceful shutdown
  config/             # Environment + MySQL helpers (execute + transactions)
  routes/             # REST route registration, v1 namespacing
  middlewares/        # Error, auth and validation handlers
  modules/            # Domain folders (auth, affiliates, links, orders, commissions, payments, settings, analytics, integrations/opencart)
  utils/              # Logger, JWT helpers, HMAC utilities, pagination
```

## Key Concepts

- **JWT Auth:** Access + refresh tokens with configurable TTLs.
- **OTP Login:** WhatsApp-first via Interakt template messaging (swap provider via env).
- **MySQL Schema:** Tables for users, affiliate_links, orders, order_items, commissions, payments, admin_settings, audit_logs.
- **Queues:** Redis + BullMQ recommended for order ingestion, commission confirmation, OTP throttling.
- **Analytics:** `/api/v1/analytics/overview` surfaces aggregate KPIs per affiliate/admin.
- **OpenCart Bridge:** Signed webhook endpoints (`/api/v1/integrations/opencart`) accept orders and status updates without slowing checkout.

## Environment

- Copy `env.example` → `.env` and fill credentials (MySQL, JWT secrets, OTP provider, Redis).
- Configure `OPENCART_WEBHOOK_SECRET` for HMAC validation.
- Provide Interakt credentials (`INTERAKT_API_TOKEN`, template details) to enable WhatsApp OTP delivery.
- Align `CORS_ORIGIN` with the React affiliate frontend.

## Scripts

- `npm run dev` – Hot reloading via `ts-node-dev`.
- `npm run build` – TypeScript compilation to `dist`.
- `npm start` – Run compiled server (`dist/server.js`).

## Next Steps

1. Wire database migration tooling (Knex, Prisma, or raw SQL migrations) and seed scripts.
2. Plug in real OTP/WhatsApp provider integrations and Redis-backed rate limiting.
3. Document REST endpoints using OpenAPI/Swagger for React & Flutter clients.
4. Integrate Redis + BullMQ workers for asynchronous order/commission processing.
5. Build audit logging + admin activity feeds, and expand analytics endpoints.

Ensure any temporary debug/log statements are removed before releasing to production per Ipshopy guidelines.

