import { Router } from "express";
import express from "express";
import { stripe } from "../config/stripe.js";
import { getDb } from "../config/db.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { User } from "../models/User.js";

export const webhookRouter = Router();
const billingRouter = Router();

webhookRouter.post("/", express.raw({ type: "application/json" }), async (req, res) => {
  const signature = req.headers["stripe-signature"];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata?.userId || session.client_reference_id;

      if (userId) {
        await getDb();

        await User.findByIdAndUpdate(userId, {
          isPremium: true,
          stripeCustomerId: typeof session.customer === "string" ? session.customer : undefined,
          stripeSubscriptionId:
            typeof session.subscription === "string" ? session.subscription : undefined
        });
      }
    }

    return res.json({ received: true });
  } catch {
    return res.status(400).send("Webhook Error");
  }
});

billingRouter.post("/create-checkout", requireAuth, async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    success_url: `${process.env.CLIENT_ORIGIN}/billing/success`,
    cancel_url: `${process.env.CLIENT_ORIGIN}/billing/cancel`,
    client_reference_id: req.currentUser._id.toString(),
    metadata: {
      userId: req.currentUser._id.toString()
    },
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1
      }
    ]
  });

  return res.json({ url: session.url });
});

export default billingRouter;
