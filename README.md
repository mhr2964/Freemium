# Freemium

Freemium is a freemium SaaS starter with session auth, MongoDB persistence, Redis-backed sessions, Stripe Checkout billing, and a Vite React frontend.

## Stack

- Node.js + Express
- MongoDB + Mongoose
- Redis-backed `express-session`
- Stripe Checkout
- React 18 + Vite
- Plain CSS

## Project Shape

- `server/` contains Express routes, config, middleware, and the Mongoose user model.
- `client/` contains the React app, routes, and plain CSS.
- Root scripts manage the backend, frontend build, linting, and combined installation.

## Requirements

- Node.js 18+
- MongoDB
- Redis
- A Stripe account with a recurring monthly Price ID
- Stripe CLI for local webhook forwarding

## Setup

1. Clone the repository and enter it with `cd freemium`.
2. Install backend dependencies with `npm install`.
3. Install frontend dependencies with `npm install --prefix client`.
4. Copy `.env.example` to `.env`.
5. Optionally copy `client/.env.example` to `client/.env` if you want the frontend to call a non-default backend URL.
6. Fill in `.env` with:
   - `PORT`
   - `NODE_ENV`
   - `CLIENT_ORIGIN`
   - `MONGODB_URI`
   - `REDIS_URL`
   - `SESSION_SECRET`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `STRIPE_PRICE_ID`
7. Start MongoDB and Redis.
8. Start the backend with `npm run dev`.
9. Start the frontend with `npm run client`.
10. In a separate terminal, forward Stripe webhooks:
    `stripe listen --forward-to localhost:5000/api/billing/webhook`
11. Copy the signing secret printed by Stripe CLI into `STRIPE_WEBHOOK_SECRET`.

## Local URLs

- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:5000/api/health`

## Auth and Billing Flow

- `POST /api/auth/register` creates a user, hashes the password with bcrypt, stores the session in Redis, and returns `{ user }`.
- `POST /api/auth/login` validates credentials and returns `{ user }`.
- `GET /api/auth/me` reads the authenticated user from Mongo on each request so premium status stays fresh.
- `POST /api/billing/create-checkout` creates a monthly Stripe Checkout session for the logged-in user.
- `POST /api/billing/webhook` handles `checkout.session.completed` and flips `isPremium` to `true`.
- `GET /api/premium/example` returns gated content only for premium users.

## Scripts

- `npm run dev` starts the Express server with nodemon.
- `npm run start` starts the Express server without nodemon.
- `npm run client` starts the Vite frontend.
- `npm run build` builds the frontend.
- `npm run lint` runs ESLint for server and client.
- `npm test` runs the lint-based boilerplate check.
- `npm run install-all` installs root and client dependencies.

## Frontend Routes

- `/login`
- `/register`
- `/dashboard`
- `/billing/success`
- `/billing/cancel`

See `CUSTOMIZING.md` for protected-route patterns, user model extensions, and changing the Stripe plan.
