# BizPilot / Compassio Server (Reference)

Standalone Node.js + Express + MongoDB backend. Run it locally alongside the Lovable frontend.

> The Lovable preview keeps using its built-in mock data — this server is reference code you run yourself. To wire the UI to it later, set `VITE_API_URL=http://localhost:5000/api` and swap the mock imports for Axios calls.

## Requirements

- Node.js 18+
- A MongoDB URI (Atlas free tier or local `mongod`)

## Setup

```bash
cd server
npm install
cp .env.example .env
# edit .env → set MONGODB_URI and JWT_SECRET
npm run dev        # nodemon, hot reload
# or
npm start
```

Server listens on `http://localhost:5000`.

## Environment (.env)

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/bizpilot
JWT_SECRET=change-me-to-a-long-random-string
NODE_ENV=development
```

## Endpoints

All non-auth routes require `Authorization: Bearer <token>`. Data is scoped to the authenticated user's `businessId`.

| Method | Path | Notes |
| --- | --- | --- |
| POST | `/api/auth/signup` | `{ name, email, password, businessName? }` → `{ token, user }` |
| POST | `/api/auth/login` | `{ email, password }` → `{ token, user }` |
| GET  | `/api/dashboard` | totals + best sellers + recent orders |
| GET  | `/api/sales?period=day\|week\|month` | grouped time series |
| POST | `/api/sales` | `{ amount, orderId?, date? }` |
| GET  | `/api/orders` | list |
| POST | `/api/orders` | `{ items:[{productId,qty,price}], total, customerId?, status? }` |
| PUT  | `/api/orders/:id` | update status/fields |
| GET  | `/api/customers` | list + per-customer order/spend |
| GET  | `/api/products` | list |
| POST | `/api/products` | `{ name, price, cost?, sku?, category?, stock? }` |
| PUT  | `/api/products/:id` | update |
| DELETE | `/api/products/:id` | admin only |
| GET  | `/api/inventory` | includes `lowStock` flag |
| GET  | `/api/analytics?unit=day\|week\|month` | trend + totals |

## Sample calls

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada","email":"ada@example.com","password":"secret123","businessName":"Ada Co"}'

# Login
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ada@example.com","password":"secret123"}' | jq -r .token)

# Authenticated request
curl http://localhost:5000/api/dashboard -H "Authorization: Bearer $TOKEN"
```

## Structure

```
server/
├── .env.example
├── package.json
└── src/
    ├── index.js
    ├── config/db.js
    ├── models/         (User, Business, Customer, Product, Inventory, Order, Sale, Analytics)
    ├── middleware/     (auth, requireRole, validate, errorHandler)
    ├── utils/          (generateToken, asyncHandler)
    ├── controllers/    (auth, dashboard, sales, orders, customers, products, inventory, analytics)
    └── routes/         (matching router modules mounted under /api)
```

## Roles

- `owner` — created on signup, full access to their business's data
- `admin` — can also delete products (any admin-only endpoints)

Change a user's role directly in MongoDB, or seed one via a script.

## Wiring the frontend later (optional)

1. `npm i axios` in the Lovable project.
2. Create `src/lib/api.ts` with a preconfigured Axios instance reading `import.meta.env.VITE_API_URL` and attaching the JWT from localStorage.
3. Replace imports from `src/lib/mock-data.ts` with API calls (e.g. `api.get('/dashboard')`).
