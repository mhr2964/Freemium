import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import authRouter from "./routes/auth.js";
import billingRouter, { webhookRouter } from "./routes/billing.js";
import healthRouter from "./routes/health.js";
import premiumRouter from "./routes/premium.js";
import { createSessionMiddleware } from "./config/session.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

async function startServer() {
  const sessionMiddleware = await createSessionMiddleware();

  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN,
      credentials: true
    })
  );
  app.use("/api/billing/webhook", webhookRouter);
  app.use(sessionMiddleware);
  app.use(express.json());

  app.use("/api/health", healthRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/billing", billingRouter);
  app.use("/api/premium", premiumRouter);

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
