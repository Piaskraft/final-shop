# Final Shop (Piaskraft Mini)

Demo e-commerce: **React + TypeScript (frontend)** + **NestJS 11 + Prisma (backend)** + **PostgreSQL**.

✅ Live demo (frontend): https://final-shop-1.onrender.com  
✅ Live API (backend): https://final-shop-qoz3.onrender.com/api  
✅ Repo: https://github.com/Piaskraft/final-shop

> Monorepo: `/backend` (Nest API) + `/client` (React UI)  
> Runtime backend uses global prefix: **/api**

---

## Tech stack

### Backend
- NestJS 11
- Prisma ORM + PostgreSQL
- Validation: global `ValidationPipe` + `class-validator` / `class-transformer`
- Scheduler: `@nestjs/schedule` (Cron)
- Cache: `cache-manager` (external endpoints, TTL 10 min)
- Integrations:
  - **Stripe** (PaymentIntent)
  - **SMTP** (Nodemailer)
- Tests: Jest (unit) + Supertest (e2e) + coverage

### Frontend
- React 19 + TypeScript
- Redux Toolkit
- React Router v7
- CRA proxy for local dev (`client/package.json` → proxy to `http://localhost:3001`)

---

## Project structure

```txt
final-shop/
  backend/            # NestJS API + Prisma
  client/             # React app
  docker-compose.yml  # PostgreSQL for local dev (root)
  README.md
  DOKUMENTACJA.mrkd
```

---

## Requirements checklist (rubric-friendly)

- ✅ **15+ endpoints** (products/orders/categories/users + payments/mail/external + health)
- ✅ **4+ HTTP methods**: GET / POST / PATCH / PUT / DELETE
- ✅ **2+ external sources / integrations**
  - External data: **currency + weather**
  - Integrations: **Stripe + SMTP**
- ✅ **Scheduler**:
  - cleanup job daily 03:00 (enabled by `CRON_ENABLED=true`)
  - external cache warm-up every 10 minutes
- ✅ **Tests + coverage**:
  - unit + e2e
  - `npm run test:cov` coverage ~ **89% statements / 65% branches**
- ✅ **Design patterns**:
  - Repository pattern (OrdersRepository + Prisma implementation)
  - Strategy pattern (PaymentStrategy + StripePaymentStrategy)
- ✅ **Constants centralization**
  - backend: `backend/src/config/constants.ts`
  - frontend: `client/src/config/constants.ts`

---

## Quick start (local)

### 0) Database (Docker) — run from repo root

`docker-compose.yml` is in the repository root.

```bash
# run in: final-shop/
docker compose up -d
```

Stop DB:

```bash
docker compose down
```

---

### 1) Backend (NestJS)

```bash
cd backend
npm ci
cp .env.example .env
```

Generate Prisma client + run migrations + seed:

```bash
npm run db:generate
npx prisma migrate dev
npm run seed
```

Start API:

```bash
npm run start:dev
```

Backend (local):
- http://localhost:3001/api
- Example: `GET http://localhost:3001/api/products`

> Tip: backend has helper scripts:
> - `npm run db:up` / `npm run db:down`
> - `npm run db:prepare` (up + generate + migrate + seed)
> - `npm run start:dev:ready` (db:prepare + start:dev)

---

### 2) Frontend (React)

```bash
cd ../client
npm ci
npm start
```

Frontend (local):  
- http://localhost:3000

API calling rules (client):
- If `REACT_APP_API_URL` is **empty** → client uses relative **`/api`** (works locally via CRA proxy)
- If `REACT_APP_API_URL` is set → client uses `${REACT_APP_API_URL}/api` (smart guard prevents `/api/api`)

Optional env for frontend:
Create `client/.env`:

```env
REACT_APP_API_URL=https://final-shop-qoz3.onrender.com
```

---

## Run as one service (backend serves frontend)

Backend is configured to serve React build from `backend/public`:
- `ServeStaticModule` serves static files
- SPA fallback is enabled in `backend/src/main.ts` when `backend/public/index.html` exists

Build everything and copy React build into backend:

```bash
cd backend
npm ci
npm run build:full
npm run start:prod
```

---

## Environment variables

### Backend

File: `backend/.env` (copy from `.env.example`)

```env
DATABASE_URL="postgresql://finalshop:finalshop@localhost:5432/finalshop?schema=public"

# Stripe (optional)
STRIPE_SECRET_KEY="sk_test_..."

# SMTP (optional)
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="user@example.com"
SMTP_PASS="password"
SMTP_FROM="no-reply@example.com"

# Scheduler (optional)
CRON_ENABLED=true
```

Important:
- If Stripe env is missing → `/api/payments/payment-intent` returns **503** (`Stripe is not configured`)
- If SMTP env is missing → `/api/mail/test` returns **503** (`Email is not configured`)

---

## Live API (Render)

Base URL (API prefix is `/api`):
- https://final-shop-qoz3.onrender.com/api

Example:
- `GET https://final-shop-qoz3.onrender.com/api/products`

---

## API endpoints (backend)

> Global prefix: **/api**  
> Example (local): `http://localhost:3001/api`

### Health
- `GET /api` → "Hello World" (simple health check)

### Products (CRUD)
- `GET /api/products` → list
- `GET /api/products/:id` → single by numeric id
- `GET /api/products/slug/:slug` → single by slug
- `POST /api/products` → create
- `PATCH /api/products/:id` → partial update
- `PUT /api/products/:id` → replace/update
- `DELETE /api/products/:id` → delete

### Orders (CRUD)
- `POST /api/orders` → create (validates items, calculates totals)
- `GET /api/orders` → list (with items + products)
- `GET /api/orders/id/:id` → details
- `PATCH /api/orders/id/:id` → update
- `DELETE /api/orders/id/:id` → delete

### Categories (CRUD)
- `GET /api/categories`
- `GET /api/categories/id/:id`
- `GET /api/categories/slug/:slug`
- `POST /api/categories`
- `PATCH /api/categories/id/:id`
- `DELETE /api/categories/id/:id`

### Users (CRUD)
- `GET /api/users`
- `GET /api/users/id/:id`
- `POST /api/users`
- `PATCH /api/users/id/:id`
- `DELETE /api/users/id/:id`

### Payments (Stripe)
- `POST /api/payments/payment-intent`
  - body: `{ "orderId": 123 }`
  - response: `{ "orderId": 123, "clientSecret": "..." }`
  - requires: `STRIPE_SECRET_KEY` (otherwise **503**)

### Mail (SMTP / Nodemailer)
- `POST /api/mail/test`
  - body: `{ "to": "...", "subject": "...", "text": "..." }`
  - requires: SMTP envs (otherwise **503**)

### External data (currency + weather) + cache
- `GET /api/external/rate?base=EUR&target=PLN`
- `GET /api/external/rates?base=EUR&target=PLN` (alias)
  - provider: frankfurter.app
  - response header: `X-Cache: HIT|MISS` (TTL ~10 min)
- `GET /api/external/weather?lat=51.4556&lon=7.0116&city=Essen`
  - provider: open-meteo.com
  - response header: `X-Cache: HIT|MISS` (TTL ~10 min)

---

## Scheduler (background jobs)

- `OrdersCleanupJob` runs daily at **03:00**:
  - enabled only when `CRON_ENABLED=true`
- `ExternalJobs.warmCache` runs every **10 minutes**:
  - warms cache for exchange rate + weather (default Essen)

---

## Validation & error handling

- Global `ValidationPipe`:
  - `whitelist: true`
  - `forbidNonWhitelisted: true`
  - `transform: true` (+ implicit conversion)
- DTO validation via `class-validator`
- Standard Nest exceptions (400/404/503 etc.)

---

## Tests & quality

### Backend

```bash
cd backend
npm run lint
npm run test
npm run test:e2e
npm run test:cov
```

Coverage output:
- `backend/coverage/`

### Frontend

```bash
cd client
npm run build
```

---

## Author

Mateusz Piasecki
