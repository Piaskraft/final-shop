
# Final Shop (Piaskraft Mini) — Abschlussprojekt

Demo e-commerce app: **React (frontend)** + **NestJS (backend)** + **Prisma (PostgreSQL)**.

✅ Live demo (Frontend / Render): https://final-shop-1.onrender.com  
✅ API (Backend / Render): https://final-shop-qoz3.onrender.com  
✅ Repo: https://github.com/Piaskraft/final-shop

---

## Stack

- Frontend: React + TypeScript
- Backend: NestJS + TypeScript
- DB: PostgreSQL + Prisma
- Payments: Stripe (Payment Intent)
- External APIs: frankfurter.app (FX), open-meteo.com (Weather)
- Mail: SMTP (optional)
- Jobs: @nestjs/schedule (CRON) + cache warmup
- Tests: Jest + e2e + coverage

---

## URLs

### Local
- Frontend: http://localhost:3000
- Backend API base: http://localhost:3001/api

### Production (Render)
- Frontend: https://final-shop-1.onrender.com
- Backend API base: https://final-shop-qoz3.onrender.com/api

---

## Features (what is implemented)

- ✅ CRUD: Products, Orders, Categories, Users (GET/POST/PATCH/DELETE)
- ✅ External integrations: currency rate + weather (2 external sources)
- ✅ Payments: Stripe payment intent endpoint
- ✅ Mail: SMTP test endpoint (disabled if env is missing)
- ✅ Background jobs: CRON cache warmup (rate + weather)
- ✅ CORS configured for local + production
- ✅ Automated tests (unit + e2e + coverage)

---

## Backend (NestJS) — API

### Minimum 15 endpoints (implemented)

**Products**
- GET    `/api/products`
- GET    `/api/products/id/:id`
- GET    `/api/products/slug/:slug`
- POST   `/api/products`
- PATCH  `/api/products/:id`
- DELETE `/api/products/:id`

**Orders**
- GET    `/api/orders`
- GET    `/api/orders/id/:id`
- POST   `/api/orders`
- PATCH  `/api/orders/id/:id`
- DELETE `/api/orders/id/:id`

**Categories**
- GET    `/api/categories`
- GET    `/api/categories/:id`
- GET    `/api/categories/slug/:slug`
- POST   `/api/categories`
- PATCH  `/api/categories/:id`
- DELETE `/api/categories/:id`

**Users**
- GET    `/api/users`
- GET    `/api/users/id/:id`
- POST   `/api/users`
- PATCH  `/api/users/id/:id`
- DELETE `/api/users/id/:id`

**Payments (Stripe)**
- POST   `/api/payments/payment-intent`

**Mail (SMTP)**
- POST   `/api/mail/test`

**External (2 sources)**
- GET    `/api/external/rate?base=EUR&target=PLN`  
  Provider: `frankfurter.app`
- GET    `/api/external/weather?lat=51.4556&lon=7.0116&city=Essen`  
  Provider: `open-meteo.com`

> Tip: External endpoints return header `X-Cache: HIT/MISS` (cache layer).

---

## External cache warmup (CRON)

A scheduled job warms up cache for external APIs (currency + weather):

- Frequency: **every 10 minutes**
- Controlled by env: `CRON_ENABLED=true`

Default warmup values:
- `base=EUR`, `target=PLN`
- Essen: `lat=51.4556`, `lon=7.0116`, `city=Essen`

---

## Design patterns (backend)

- **Repository pattern**  
  `OrdersRepository` + `PrismaOrdersRepository`  
  (separates DB access layer from service logic)

- **Strategy pattern**  
  `PaymentStrategy` + `StripePaymentStrategy` used by `PaymentsService`  
  (easy to swap payment provider)

---

## Local setup

### 1) Install

```bash
cd backend
npm install

cd ../client
npm install
````

### 2) Start PostgreSQL via Docker Compose

From repo root:

```bash
docker context use desktop-linux
docker compose up -d
docker compose ps
```

DB runs on:

* host: `localhost`
* port: `5433` (mapped to container `5432`)

### 3) Backend ENV (`backend/.env`)

Create `backend/.env` (based on `.env.example`):

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/final_shop?schema=public
PORT=3001

# Stripe
STRIPE_SECRET_KEY=

# SMTP (optional)
SMTP_HOST=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

# Jobs
CRON_ENABLED=true
```

### 4) Prisma (migrations / generate)

```bash
cd backend
npx prisma generate
npx prisma migrate dev
# (optional) if you have seed:
# npx prisma db seed
```

### 5) Run backend

```bash
cd backend
npm run start:dev
```

Backend: [http://localhost:3001/api](http://localhost:3001/api)

### 6) Run frontend

```bash
cd client
npm start
```

Frontend: [http://localhost:3000](http://localhost:3000)

---

## Frontend environment

### Production (Render)

In Render → Static Site → Environment:

* `REACT_APP_API_URL=https://final-shop-qoz3.onrender.com`

### Local

Frontend uses proxy to backend:

* requests to `/api/...` go to `http://localhost:3001`

---

## Quick smoke tests (local)

### Products

```bash
curl -i http://localhost:3001/api/products
curl -i http://localhost:3001/api/products/slug/mjw-ringmaulschluessel-10mm
```

### External APIs

```bash
curl -i "http://localhost:3001/api/external/rate?base=EUR&target=PLN"
curl -i "http://localhost:3001/api/external/weather?lat=51.4556&lon=7.0116&city=Essen"
```

### CRUD check (Products) — POST / PATCH / PUT / DELETE

```bash
# POST (create)
curl -i -X POST "http://localhost:3001/api/products" \
  -H "Content-Type: application/json" \
  -d '{"name":"TMP","slug":"tmp-123","price":9.99,"description":"tmp","mainImage":"https://via.placeholder.com/1"}'

# PATCH (partial update)
curl -i -X PATCH "http://localhost:3001/api/products/5" \
  -H "Content-Type: application/json" \
  -d '{"name":"TMP2"}'

# PUT (replace)
curl -i -X PUT "http://localhost:3001/api/products/5" \
  -H "Content-Type: application/json" \
  -d '{"name":"TMP3","slug":"tmp-123","price":9.99,"description":"tmp","mainImage":"https://via.placeholder.com/1"}'

# DELETE
curl -i -X DELETE "http://localhost:3001/api/products/5"
```

---

## Tests (backend)

```bash
cd backend
npm run lint
npm run test
npm run test:e2e
npm run test:cov
```

---

## CORS

Configured in `backend/src/main.ts`.

Allowed origins:

* `https://final-shop-1.onrender.com`
* `http://localhost:3000`

---

## Author

Mateusz Piasecki
Piaskraft — Demo-Shop für Abschlussprojekt
