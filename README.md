# Final Shop (Piaskraft Mini)

✅ Live demo (Render): https://final-shop-1.onrender.com  
✅ API https://final-shop-qoz3.onrender.com/products
Repo: https://github.com/Piaskraft/final-shop


# Final Shop (Piaskraft Mini) — Abschlussprojekt

A demo e-commerce app: **React (frontend)** + **NestJS (backend)** + **Prisma (PostgreSQL)**.

 test:   npm run lint && npm run test && npm run test:e2e && npm run test:cov

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

* `DATABASE_URL`=
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
