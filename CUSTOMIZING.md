# Customizing Freemium

## Add a Protected Route

Server-side protected routes should reuse `requireAuth` from `server/middleware/requireAuth.js`. That middleware refreshes the current user from Mongo before the route runs, so `req.currentUser` reflects the latest `isPremium` value.

Example pattern:

```js
import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.get("/reports", requireAuth, (req, res) => {
  res.json({ userId: req.currentUser._id.toString() });
});

export default router;
```

Mount the router from `server/index.js` under the `/api` prefix.

## Extend the User Model

Edit `server/models/User.js` to add new fields to the schema. Keep DB-dependent reads and writes behind a call to `getDb()` inside each request path before using the Mongoose model.

If the new field should also be visible to the client on login or session restore:

- add it to `formatUser()` in `server/utils/auth.js`
- update the relevant React UI in `client/src/App.jsx`

If the new field affects authorization, check it inside `requireAuth` consumers or in a route-specific middleware.

## Change the Stripe Plan

This template uses one monthly recurring Stripe Price through `STRIPE_PRICE_ID` in `.env`.

To change it:

1. Create or choose a different recurring Price in Stripe.
2. Replace `STRIPE_PRICE_ID` in `.env`.
3. If you need different success or cancel destinations, update the URLs in `server/routes/billing.js`.

The current implementation only upgrades a user on `checkout.session.completed`. Cancellation, downgrades, and portal flows are intentionally out of scope for this starter.
