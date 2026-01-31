Jasne — masz tu **cały README.md poprawiony 1:1** (formatowanie, code fences, spójne ścieżki, Docker Compose w root, `.env.example` w backend, poprawne `DATABASE_URL`, przykłady LIVE, zero błędnych backticków). Skopiuj i wklej jako **README.md w root repo**.

````md
# Final Shop (Piaskraft Mini)

Demo e-commerce: **React + TypeScript (frontend)** + **NestJS + Prisma (backend)** + **PostgreSQL**.

✅ Live demo (frontend): https://final-shop-1.onrender.com  
✅ Repo: https://github.com/Piaskraft/final-shop  

> Monorepo: `/backend` (API) + `/client` (UI)  
> Backend uses global prefix: **/api**

---

## Tech stack

### Backend
- NestJS 11
- Prisma ORM + PostgreSQL
- ValidationPipe + `class-validator` / `class-transformer`
- Scheduler: `@nestjs/schedule` (Cron)
- Integrations: **Stripe** + **SMTP (Nodemailer)**
- External data: **Currency + Weather APIs**
- Cache: `cache-manager` (used for external endpoints)
- Tests: Jest + Supertest (unit + e2e)

### Frontend
- React 19 + TypeScript
- Redux Toolkit
- React Router v7

---

## Project structure

```txt
final-shop/
  backend/   # NestJS API + Prisma
  client/    # React app
  docker-compose.yml   # PostgreSQL for local dev
````

---

## Requirements checklist (rubric-friendly)

* ✅ **15+ endpoints** (CRUD for products/orders/users/categories + payments/mail/external)
* ✅ **4+ HTTP methods**: GET / POST / PATCH / PUT / DELETE
* ✅ **2+ external integrations**

  * Stripe (PaymentIntent)
  * SMTP mail (Nodemailer)
* ✅ **Scheduler**: Cron job (`@Cron`)
* ✅ **Tests + coverage**

  * unit tests + e2e
  * coverage artifacts in `backend/coverage/` (≈ 70%+ lines/statements)
* ✅ **Design patterns (explicit)**

  * Repository pattern (OrdersRepository + PrismaOrdersRepository)
  * Strategy pattern (PaymentStrategy + StripePaymentStrategy)
* ✅ **Constants centralization**

  * backend: `backend/src/config/constants.ts`
  * frontend: `client/src/config/constants.ts`

---

## Quick start (local)

### 0) Database (Docker) — run from repo root

> `docker-compose.yml` is located in the **repository root**.

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
npm install
```

Create env (recommended):

```bash
cp .env.example .env
```

Run migrations + seed:

```bash
npx prisma generate
npx prisma migrate dev
npm run seed
```

Start API:

```bash
npm run start:dev
```

Backend base URL (local):

* [http://localhost:3001/api](http://localhost:3001/api)

Example:

* `GET http://localhost:3001/api/products`

---

### 2) Frontend (React)

```bash
cd ../client
npm install
npm start
```

Frontend (local):

* [http://localhost:3000](http://localhost:3000)

Optional env to point to a remote backend:

* create `client/.env` and set:

```env
REACT_APP_API_URL=https://your-backend-domain
```

Notes:

* Frontend builds API base as: `${REACT_APP_API_URL}/api`
* If `REACT_APP_API_URL` is empty, frontend uses relative `/api` (works locally thanks to CRA proxy)

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

---

## Live API example (Render)

Backend uses prefix **/api**. Example:

* `GET https://final-shop-qoz3.onrender.com/api/products`

---

## API endpoints (backend)

> Global prefix: **/api**
> Example base URL (local): `http://localhost:3001/api`

### Health

* `GET /api` → "Hello World" (simple health check)

### Products (CRUD)

* `GET /api/products` → list
* `GET /api/products/:id` → single by numeric id
* `GET /api/products/slug/:slug` → single by slug
* `POST /api/products` → create
* `PATCH /api/products/:id` → partial update
* `PUT /api/products/:id` → replace/update
* `DELETE /api/products/:id` → delete

### Orders (CRUD)

* `GET /api/orders` → list (with items + products)
* `GET /api/orders/id/:id` → details
* `POST /api/orders` → create (validates items, calculates total)
* `PATCH /api/orders/id/:id` → update (optionally recalculates total if items provided)
* `DELETE /api/orders/id/:id` → delete

### Categories (CRUD)

* `GET /api/categories`
* `GET /api/categories/id/:id`
* `GET /api/categories/slug/:slug`
* `POST /api/categories`
* `PATCH /api/categories/id/:id`
* `DELETE /api/categories/id/:id`

### Users (CRUD)

* `GET /api/users`
* `GET /api/users/id/:id`
* `POST /api/users`
* `PATCH /api/users/id/:id`
* `DELETE /api/users/id/:id`

### Payments (Stripe)

* `POST /api/payments/payment-intent`

  * body: `{ "orderId": 123 }`
  * response: `{ "orderId": 123, "clientSecret": "..." }`
  * requires: `STRIPE_SECRET_KEY`

### Mail (SMTP / Nodemailer)

* `POST /api/mail/test`

  * body: `{ "to": "...", "subject": "...", "text": "..." }`
  * requires: `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`

### External data (2 sources + cache)

* `GET /api/external/rate?base=EUR&target=PLN`

  * provider: frankfurter.app
  * response header: `X-Cache: HIT|MISS`
* `GET /api/external/rates?base=EUR&target=PLN` (alias / compatibility)
* `GET /api/external/weather?lat=52.52&lon=13.41&city=Berlin`

  * provider: open-meteo.com
  * response header: `X-Cache: HIT|MISS`

---

## Scheduler (background job)

* Cron job runs daily at 03:00 server time:

  * `OrdersCleanupJob` (`@Cron(CronExpression.EVERY_DAY_AT_3AM)`)

Enable/disable via env:

```env
CRON_ENABLED=true
```

---

## Validation & error handling

* Global `ValidationPipe` enabled:

  * `whitelist: true`
  * `forbidNonWhitelisted: true`
  * `transform: true` (+ implicit conversion)
* DTO validation via `class-validator`
* Consistent HTTP errors: `NotFoundException`, `BadRequestException`, etc.

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

* `backend/coverage/`

### Frontend

```bash
cd client
npm test
```

---

## Deployment (Render)

* Frontend deployed as static React build
* Backend deployed as NestJS API service (separate from frontend)
* CORS configured for:

  * [https://final-shop-1.onrender.com](https://final-shop-1.onrender.com)
  * [http://localhost:3000](http://localhost:3000)

---

## Author

Mateusz Piasecki

