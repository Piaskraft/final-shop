
# Final Shop (Piaskraft Mini)

Demo e-commerce: **React + TypeScript (frontend)** + **NestJS + Prisma (backend)** + **PostgreSQL**.

✅ Live demo (frontend): https://final-shop-1.onrender.com  
✅ Repo: https://github.com/Piaskraft/final-shop

> Monorepo: `/backend` (API) + `/client` (UI)

---

## Tech stack

**Backend**
- NestJS 11
- Prisma ORM + PostgreSQL
- ValidationPipe + `class-validator` / `class-transformer`
- Scheduler: `@nestjs/schedule` (Cron)
- Integrations: **Stripe** + **SMTP (Nodemailer)**
- External data proxy: **Currency + Weather APIs**
- Cache: `cache-manager` (used for external endpoints)
- Tests: Jest + Supertest (unit + e2e)

**Frontend**
- React 19 + TypeScript
- Redux Toolkit
- React Router v7

---

## Project structure

```

final-shop/
backend/        # NestJS API + Prisma
client/         # React app

````

---

## Requirements checklist (rubric-friendly)

- ✅ **15+ endpoints** (CRUD for products/orders/users/categories + payments/mail/external)
- ✅ **4 methods HTTP**: GET / POST / PATCH / PUT / DELETE
- ✅ **2 external integrations**:
  - Stripe (PaymentIntent)
  - SMTP mail (Nodemailer)
- ✅ **Scheduler**: Cron job (`@Cron`)
- ✅ **Tests + coverage**:
  - unit tests + e2e
  - coverage from repo artifacts: ~**71% lines**, ~**72% statements**
- ✅ **Design patterns (explicit)**:
  - Repository pattern (OrdersRepository + PrismaOrdersRepository)
  - Strategy pattern (StripePaymentStrategy implementing PaymentStrategy interface)
- ✅ **Constants centralization**
  - backend: `src/config/constants.ts`
  - frontend: `src/config/constants.ts`

---

## Quick start (local)

### 1) Backend

#### Prerequisites
- Node.js (LTS)
- PostgreSQL (local or Docker)

#### Setup
```bash
cd backend
npm install
````

#### Env

Create `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/final_shop?schema=public

# optional (Stripe)
STRIPE_SECRET_KEY=sk_test_...

# optional (SMTP mail)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=your_password
SMTP_FROM=no-reply@example.com

# optional (Scheduler)
CRON_ENABLED=true
```

#### DB migrate + seed

```bash
npx prisma generate
npx prisma migrate dev
npm run seed
```

#### Run API

```bash
npm run start:dev
```

API runs on:

* [http://localhost:3001/api](http://localhost:3001/api)

---

### 2) Frontend

```bash
cd ../client
npm install
```

#### Env (optional)

If you want to point frontend to a remote API, set:

```env
REACT_APP_API_URL=https://your-backend-domain
```

Notes:

* Frontend automatically builds API base as `${REACT_APP_API_URL}/api`.
* If `REACT_APP_API_URL` is empty, frontend uses relative `/api` (works locally thanks to CRA proxy).

#### Run UI

```bash
npm start
```

Frontend runs on:

* [http://localhost:3000](http://localhost:3000)

---

## API endpoints (backend)

> Global prefix: **/api**
> Example base URL (local): `http://localhost:3001/api`

### Health / root

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
* `GET /api/external/rates?base=EUR&target=PLN` (alias for backward compatibility)
* `GET /api/external/weather?lat=52.52&lon=13.41&city=Berlin`

  * provider: open-meteo.com
  * response header: `X-Cache: HIT|MISS`

---

## Scheduler (background job)

* Cron job runs daily at 03:00 server time:

  * `OrdersCleanupJob` (`@Cron(CronExpression.EVERY_DAY_AT_3AM)`)

Enable it via env:

```env
CRON_ENABLED=true
```

---

## Validation & error handling

* Global `ValidationPipe` enabled:

  * `whitelist: true`
  * `forbidNonWhitelisted: true`
  * `transform: true` (+ implicit conversion)
* DTO validation via `class-validator` (products/orders/users/categories/payments/mail)
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

Coverage artifacts are included in repo under `backend/coverage/`.

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

  * `https://final-shop-1.onrender.com`
  * `http://localhost:3000`

---

## Author

Mateusz Piasecki

