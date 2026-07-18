# Add Express + MongoDB reference backend

Scope: purely additive. No changes to the current TanStack Start app, routes, mock data, or UI. The Lovable preview keeps running exactly as it does today. The new `server/` folder is a self-contained Node.js project the user runs locally against their own MongoDB.

## What gets created

```text
server/
  package.json            # express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv, morgan, express-validator, nodemon
  .env.example            # PORT=5000, MONGODB_URI=, JWT_SECRET=
  .gitignore              # node_modules, .env
  README.md               # setup + run instructions, full endpoint list, sample curl calls
  src/
    index.js              # app bootstrap: dotenv, cors, json, morgan, routes, error handler, mongoose connect, listen
    config/
      db.js               # mongoose.connect(MONGODB_URI)
    models/
      User.js             # name, email (unique), passwordHash, role: 'admin'|'owner', businessId
      Business.js         # name, ownerId, createdAt
      Customer.js         # businessId, name, email, phone, totalSpent, createdAt
      Product.js          # businessId, name, sku, price, cost, category, stock
      Inventory.js        # productId, businessId, quantity, reorderLevel, lastRestocked
      Order.js            # businessId, customerId, items[{productId, qty, price}], total, status, createdAt
      Sale.js             # businessId, orderId, amount, date
      Analytics.js        # businessId, date, revenue, orders, customers, topProducts[]
    middleware/
      auth.js             # verifies JWT, attaches req.user
      requireRole.js      # role gate ('admin' | 'owner')
      validate.js         # express-validator result handler
      errorHandler.js     # central error responder (status, message, stack in dev)
    utils/
      generateToken.js    # jwt.sign({id, role}, JWT_SECRET, 7d)
      asyncHandler.js     # try/catch wrapper for controllers
    controllers/
      authController.js       # signup (bcrypt hash, create user+business, token), login (compare, token)
      dashboardController.js  # aggregates revenue, orders, customers, best sellers, recent orders
      salesController.js      # list + create, daily/weekly/monthly aggregations
      orderController.js      # list, create, update status
      customerController.js   # list, insights
      productController.js    # list, create, update, delete
      inventoryController.js  # list, low-stock flag
      analyticsController.js  # trend series, revenue analytics
    routes/
      authRoutes.js        # POST /signup, POST /login
      dashboardRoutes.js   # GET /
      salesRoutes.js       # GET /, POST /
      orderRoutes.js       # GET /, POST /, PUT /:id
      customerRoutes.js    # GET /
      productRoutes.js     # GET /, POST /, PUT /:id, DELETE /:id
      inventoryRoutes.js   # GET /
      analyticsRoutes.js   # GET /
```

All non-auth routes go through `auth` middleware and are scoped by `req.user.businessId`. `DELETE /api/products/:id` additionally requires `admin` via `requireRole`.

Endpoints match the spec exactly, all mounted under `/api`:

```text
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/dashboard
GET    /api/sales           POST /api/sales
GET    /api/orders          POST /api/orders          PUT /api/orders/:id
GET    /api/customers
GET    /api/products        POST /api/products        PUT /api/products/:id   DELETE /api/products/:id
GET    /api/inventory
GET    /api/analytics
```

CORS is enabled with `origin: '*'` (documented as tighten-before-prod). Validation with `express-validator` on every POST/PUT. Central `errorHandler` returns `{ error: message }` with proper status codes.

## What does NOT change

- No edits to `src/`, `src/routes/`, `src/lib/mock-data.ts`, or any component.
- No Axios wiring, no `VITE_API_URL`, no auth context swap in the frontend. The Lovable preview keeps using mock data exactly as it does now — per your choice.
- No changes to `package.json`, `vite.config.ts`, or the TanStack app's build.

## README contents (server/README.md)

- Prereqs: Node 18+, a MongoDB URI (Atlas free tier or local `mongod`).
- Setup: `cd server && npm install && cp .env.example .env`, fill in `MONGODB_URI` and `JWT_SECRET`.
- Run: `npm run dev` (nodemon) or `npm start`. Listens on `http://localhost:5000`.
- Full endpoint table with sample `curl` for signup/login and one authenticated GET.
- Note: to later connect the Lovable frontend, set `VITE_API_URL=http://localhost:5000/api` and swap mock imports for Axios calls — not done in this task.

## Technical notes

- Passwords: `bcryptjs` (pure JS, no native build headaches), 10 rounds.
- JWT: 7-day expiry, `Authorization: Bearer <token>` header.
- Signup creates a `Business` and assigns the new user as `owner` with that `businessId`.
- Dashboard aggregation uses a single `Promise.all` of Mongoose aggregation pipelines for revenue sum, order count, customer count, top 5 products by quantity, and last 10 orders.
- Sales trend endpoint groups by day/week/month via `$dateTrunc` for the last N periods.
