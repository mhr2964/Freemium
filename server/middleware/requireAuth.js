import { getDb } from "../config/db.js";
import { User } from "../models/User.js";
import { setSessionUser } from "../utils/auth.js";

export async function requireAuth(req, res, next) {
  if (!req.session.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  await getDb();

  const user = await User.findById(req.session.user.id);

  if (!user) {
    req.session.destroy(() => {});
    return res.status(401).json({ error: "Unauthorized" });
  }

  setSessionUser(req, user);
  req.currentUser = user;

  return next();
}
