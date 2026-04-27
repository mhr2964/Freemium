import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.get("/example", requireAuth, (req, res) => {
  if (!req.currentUser.isPremium) {
    return res.status(403).json({ error: "Premium required" });
  }

  return res.json({ data: "this is gated content" });
});

export default router;
