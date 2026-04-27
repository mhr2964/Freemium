# Freemium

Freemium is a production-oriented SaaS starter built with an Express backend at the repo root and a Vite React frontend in `client/`.

## Stack

- Node.js + Express
- MongoDB + Mongoose
- Redis-backed `express-session`
- Stripe Checkout
- React 18 + Vite
- Plain CSS

## Setup

1. Install root dependencies with `npm install`.
2. Install client dependencies with `npm install --prefix client`.
3. Copy `.env.example` to `.env` and fill in MongoDB, Redis, Stripe, and session settings.
4. Start the backend with `npm run dev`.
5. Start the frontend with `npm run client`.

## Scripts

- `npm run dev` starts the Express server with nodemon.
- `npm run start` starts the Express server without nodemon.
- `npm run client` starts the Vite frontend.
- `npm run build` builds the frontend.
- `npm run lint` runs ESLint for server and client.
- `npm run install-all` installs root and client dependencies.

Additional setup and customization details will be expanded as the template is completed.
