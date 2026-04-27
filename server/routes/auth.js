import { Router } from "express";
import bcrypt from "bcrypt";
import { getDb } from "../config/db.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { User } from "../models/User.js";
import { formatUser, setSessionUser } from "../utils/auth.js";

const router = Router();

function isValidCredential(value) {
  return typeof value === "string" && value.trim().length >= 3;
}

router.post("/register", async (req, res) => {
  const { username, password } = req.body ?? {};

  if (!isValidCredential(username) || !isValidCredential(password)) {
    return res.status(400).json({ error: "Username and password must be at least 3 characters" });
  }

  await getDb();

  const normalizedUsername = username.trim();
  const existingUser = await User.findOne({ username: normalizedUsername });

  if (existingUser) {
    return res.status(400).json({ error: "Username already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    username: normalizedUsername,
    passwordHash,
    isPremium: false
  });

  setSessionUser(req, user);

  return res.status(201).json({
    user: formatUser(user)
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body ?? {};

  if (!isValidCredential(username) || !isValidCredential(password)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  await getDb();

  const user = await User.findOne({ username: username.trim() });

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  setSessionUser(req, user);

  return res.json({
    user: formatUser(user)
  });
});

router.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({ error: "Failed to logout" });
    }

    return res.json({ ok: true });
  });
});

router.get("/me", requireAuth, async (req, res) => {
  return res.json({
    user: formatUser(req.currentUser)
  });
});

export default router;
