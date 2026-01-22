.


# Final Shop (Piaskraft Mini) — Abschlussprojekt

A demo e-commerce app: **React (frontend)** + **NestJS (backend)** + **Prisma (PostgreSQL)**.

## Live (Render)

* **Frontend (Static Site):** [https://final-shop-1.onrender.com](https://final-shop-1.onrender.com)
* **Backend (API / Web Service):** [https://final-shop-qoz3.onrender.com](https://final-shop-qoz3.onrender.com)

## Repo structure

```
final-shop/
  backend/   # NestJS + Prisma
  client/    # React + TS
```

## Requirements

* Node.js (LTS)
* npm
* PostgreSQL (lokalnie) lub Render PostgreSQL

---

## Local setup

### 1) Install

```bash
cd backend
npm install

cd ../client
npm install
```

### 2) Run locally

**Backend**

```bash
cd backend
npm run start:dev
```

Backend: [http://localhost:3001](http://localhost:3001)

**Frontend**

```bash
cd client
npm start
```

Frontend: [http://localhost:3000](http://localhost:3000)

---

## Environment variables

### Frontend (Render)

W Render → Static Site → Environment:

* `REACT_APP_API_URL` = `https://final-shop-qoz3.onrender.com`

*(lokalnie możesz też ustawić `.env` w `client/` jeśli chcesz, ale nie jest wymagane do samego deployu)*

### Backend (Render)

W Render → Web Service → Environment:

* `DATABASE_URL` = postgresql://final_shop_db_user:qXd6NlqOheeQelHVoSLnIAA5lfD0xe8J@dpg-d5jup71r0fns73dd1b5g-a.frankfurt-postgres.render.com/final_shop_db
* `PORT` = (Render ustawia sam, app używa `process.env.PORT`)

---

## API endpoints

### Products

* `GET /products`
* `GET /products/:slug`

### Orders

* `GET /orders`
* `POST /orders`

Base URL:

* Lokalnie: `http://localhost:3001`
* Produkcja: `https://final-shop-qoz3.onrender.com`

---

## CORS

CORS jest skonfigurowany w:

* `backend/src/main.ts`

Dozwolone originy:

* `https://final-shop-1.onrender.com`
* `http://localhost:3000`

---

## Quick test (production)

1. Wejdź na frontend: [https://final-shop-1.onrender.com](https://final-shop-1.onrender.com)
2. Sprawdź `GET /products` (Network: status 200)
3. Dodaj produkt do koszyka
4. Checkout → wyślij zamówienie (Network: `POST /orders` status 201)

---

## Author
Mateusz Piasecki 
Piaskraft — Demo-Shop für Abschlussprojekt
