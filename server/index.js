import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import healthRouter from "./routes/health.js";
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
  app.use(express.json());
  app.use(sessionMiddleware);

  app.use("/api/health", healthRouter);

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
